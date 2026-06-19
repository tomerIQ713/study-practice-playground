import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb } from '../db/connection.js'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { queryRows } from '../db/utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads')

const router = Router()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

router.post('/', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Classroom name is required' })
    }

    const db = await getDb()
    let code
    let attempts = 0

    do {
      code = generateCode()
      const existing = queryRows(db, `SELECT id FROM classrooms WHERE code = ?`, [code])
      if (existing.length === 0) break
      attempts++
    } while (attempts < 10)

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Failed to generate unique code' })
    }

    db.run(`INSERT INTO classrooms (name, code, teacher_id) VALUES (?, ?, ?)`, [name.trim(), code, req.user.id])

    const rows = queryRows(db, `SELECT * FROM classrooms WHERE code = ?`, [code])
    const classroom = rows[0]

    res.status(201).json({ id: classroom.id, name: classroom.name, code: classroom.code, teacher_id: classroom.teacher_id, created_at: classroom.created_at })
  } catch (err) {
    console.error('Create classroom error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `
      SELECT c.id, c.name, c.code, c.created_at,
        (SELECT COUNT(*) FROM enrollments e WHERE e.classroom_id = c.id) AS student_count
      FROM classrooms c
      WHERE c.teacher_id = ?
      ORDER BY c.created_at DESC
    `, [req.user.id])

    res.json(rows)
  } catch (err) {
    console.error('List classrooms error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/my', verifyToken, requireRole('student'), async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `
      SELECT c.id, c.name, c.code, c.created_at, e.joined_at
      FROM enrollments e
      JOIN classrooms c ON c.id = e.classroom_id
      WHERE e.student_id = ?
      ORDER BY e.joined_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch (err) {
    console.error('My classrooms error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/join', verifyToken, requireRole('student'), async (req, res) => {
  try {
    const { code } = req.body
    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Class code is required' })
    }

    const db = await getDb()
    const classrooms = queryRows(db, `SELECT * FROM classrooms WHERE code = ?`, [code.trim().toUpperCase()])

    if (classrooms.length === 0) {
      return res.status(404).json({ error: 'Classroom not found with that code' })
    }

    const classroom = classrooms[0]
    const existing = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, classroom.id])

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already enrolled in this classroom' })
    }

    db.run(`INSERT INTO enrollments (student_id, classroom_id) VALUES (?, ?)`, [req.user.id, classroom.id])

    const rows = queryRows(db, `SELECT * FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, classroom.id])

    res.status(201).json({ id: rows[0].id, classroom: { id: classroom.id, name: classroom.name } })
  } catch (err) {
    console.error('Join classroom error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id/roster', verifyToken, requireRole('student'), async (req, res) => {
  try {
    const db = await getDb()

    const enrollment = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, req.params.id])
    if (enrollment.length === 0) {
      return res.status(403).json({ error: 'You are not enrolled in this classroom' })
    }

    const classrooms = queryRows(db, `
      SELECT c.id, c.name, c.teacher_id, c.created_at, u.name AS teacher_name
      FROM classrooms c
      JOIN users u ON u.id = c.teacher_id
      WHERE c.id = ?
    `, [req.params.id])

    if (classrooms.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const classroom = classrooms[0]
    const students = queryRows(db, `
      SELECT u.id, u.name, u.email, e.joined_at
      FROM enrollments e
      JOIN users u ON u.id = e.student_id
      WHERE e.classroom_id = ?
      ORDER BY u.name
    `, [req.params.id])

    res.json({ ...classroom, students })
  } catch (err) {
    console.error('Classroom roster error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const classrooms = queryRows(db, `SELECT * FROM classrooms WHERE id = ? AND teacher_id = ?`, [req.params.id, req.user.id])

    if (classrooms.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const classroom = classrooms[0]
    const students = queryRows(db, `
      SELECT u.id, u.name, u.email, e.joined_at
      FROM enrollments e
      JOIN users u ON u.id = e.student_id
      WHERE e.classroom_id = ?
      ORDER BY u.name
    `, [req.params.id])

    res.json({ ...classroom, students })
  } catch (err) {
    console.error('Get classroom error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id/students', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const students = queryRows(db, `
      SELECT u.id, u.name, u.email, e.joined_at
      FROM enrollments e
      JOIN users u ON u.id = e.student_id
      WHERE e.classroom_id = ?
      ORDER BY u.name
    `, [req.params.id])

    res.json(students)
  } catch (err) {
    console.error('List students error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const classroom = queryRows(db, `SELECT id FROM classrooms WHERE id = ? AND teacher_id = ?`, [req.params.id, req.user.id])
    if (classroom.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const assignments = queryRows(db, `SELECT file_attachment, starter_files FROM assignments WHERE classroom_id = ?`, [req.params.id])
    for (const a of assignments) {
      if (a.file_attachment) {
        try { fs.unlinkSync(path.join(UPLOADS_DIR, a.file_attachment)) } catch { /* ok */ }
      }
      let files = []
      try { files = JSON.parse(a.starter_files || '[]') } catch { /* ok */ }
      for (const f of files) {
        try { fs.unlinkSync(path.join(UPLOADS_DIR, f)) } catch { /* ok */ }
      }
    }

    db.run(`DELETE FROM messages WHERE classroom_id = ?`, [req.params.id])
    db.run(`DELETE FROM submissions WHERE assignment_id IN (SELECT id FROM assignments WHERE classroom_id = ?)`, [req.params.id])
    db.run(`DELETE FROM assignments WHERE classroom_id = ?`, [req.params.id])
    db.run(`DELETE FROM enrollments WHERE classroom_id = ?`, [req.params.id])
    db.run(`DELETE FROM classrooms WHERE id = ?`, [req.params.id])

    res.json({ ok: true })
  } catch (err) {
    console.error('Delete classroom error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id/students/:studentId', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const classroom = queryRows(db, `SELECT id FROM classrooms WHERE id = ? AND teacher_id = ?`, [req.params.id, req.user.id])
    if (classroom.length === 0) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    db.run(`DELETE FROM enrollments WHERE classroom_id = ? AND student_id = ?`, [req.params.id, req.params.studentId])
    res.json({ ok: true })
  } catch (err) {
    console.error('Remove student error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
