import { Router } from 'express'
import { getDb } from '../db/connection.js'
import { verifyToken } from '../middleware/auth.js'
import { queryRows } from '../db/utils.js'

const router = Router()

router.get('/classrooms/:classroomId/messages', verifyToken, async (req, res) => {
  try {
    const db = await getDb()
    const { classroomId } = req.params
    const { recipient } = req.query

    const classrooms = queryRows(db, `SELECT * FROM classrooms WHERE id = ?`, [classroomId])
    if (classrooms.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const classroom = classrooms[0]
    let otherUserId

    if (req.user.role === 'teacher') {
      if (classroom.teacher_id !== req.user.id) {
        return res.status(403).json({ error: 'You do not own this classroom' })
      }
      if (!recipient) {
        return res.status(400).json({ error: 'recipient query param required' })
      }
      otherUserId = recipient
    } else {
      if (classroom.teacher_id !== parseInt(recipient || 0) && !recipient) {
        otherUserId = classroom.teacher_id
      } else {
        otherUserId = recipient
      }
      const enrolled = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, classroomId])
      if (enrolled.length === 0) {
        return res.status(403).json({ error: 'You are not enrolled in this classroom' })
      }
    }

    const rows = queryRows(db, `
      SELECT m.id, m.content, m.assignment_id, m.created_at, m.read_at,
             u.name AS sender_name, u.role AS sender_role,
             a.title AS assignment_title
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      LEFT JOIN assignments a ON a.id = m.assignment_id
      WHERE m.classroom_id = ?
        AND ((m.sender_id = ? AND m.recipient_id = ?)
          OR (m.sender_id = ? AND m.recipient_id = ?))
      ORDER BY m.created_at ASC
    `, [classroomId, req.user.id, otherUserId, otherUserId, req.user.id])

    res.json(rows)
  } catch (err) {
    console.error('Get messages error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/classrooms/:classroomId/messages', verifyToken, async (req, res) => {
  try {
    const db = await getDb()
    const { classroomId } = req.params
    const { recipient_id, content, assignment_id } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' })
    }

    if (!recipient_id) {
      return res.status(400).json({ error: 'recipient_id is required' })
    }

    const classrooms = queryRows(db, `SELECT * FROM classrooms WHERE id = ?`, [classroomId])
    if (classrooms.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const classroom = classrooms[0]

    if (req.user.role === 'teacher') {
      if (classroom.teacher_id !== req.user.id) {
        return res.status(403).json({ error: 'You do not own this classroom' })
      }
      const enrolled = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [recipient_id, classroomId])
      if (enrolled.length === 0) {
        return res.status(400).json({ error: 'Recipient is not enrolled in this classroom' })
      }
    } else {
      if (classroom.teacher_id !== parseInt(recipient_id)) {
        return res.status(400).json({ error: 'Students can only message the teacher' })
      }
      const enrolled = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, classroomId])
      if (enrolled.length === 0) {
        return res.status(403).json({ error: 'You are not enrolled in this classroom' })
      }
    }

    if (assignment_id) {
      const assn = queryRows(db, `SELECT id FROM assignments WHERE id = ? AND classroom_id = ?`, [assignment_id, classroomId])
      if (assn.length === 0) {
        return res.status(400).json({ error: 'Assignment not found in this classroom' })
      }
    }

    db.run(`
      INSERT INTO messages (classroom_id, sender_id, recipient_id, assignment_id, content)
      VALUES (?, ?, ?, ?, ?)
    `, [classroomId, req.user.id, recipient_id, assignment_id || null, content.trim()])

    const rows = queryRows(db, `
      SELECT m.id, m.content, m.assignment_id, m.created_at, m.read_at,
             u.name AS sender_name, u.role AS sender_role,
             a.title AS assignment_title
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      LEFT JOIN assignments a ON a.id = m.assignment_id
      WHERE m.id = last_insert_rowid()
    `)

    res.status(201).json(rows[0])
  } catch (err) {
    console.error('Send message error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/messages/:id/read', verifyToken, async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `SELECT * FROM messages WHERE id = ?`, [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' })
    }

    if (rows[0].recipient_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the recipient can mark as read' })
    }

    db.run(`UPDATE messages SET read_at = datetime('now') WHERE id = ?`, [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error('Mark read error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
