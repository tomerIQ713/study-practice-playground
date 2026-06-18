import { Router } from 'express'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { fileTypeFromBuffer } from 'file-type'
import { getDb } from '../db/connection.js'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { uploadLimiter } from '../middleware/rateLimit.js'
import { queryRows } from '../db/utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads')

const ALLOWED_EXTENSIONS = ['.txt', '.sql', '.py', '.cs', '.c', '.java', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.pdf']

const EXT_MIME_MAP = {
  '.txt': ['text/plain'],
  '.sql': ['application/x-sql', 'text/plain'],
  '.py': ['text/x-python', 'text/plain', 'text/x-script.python'],
  '.cs': ['text/x-csharp', 'text/plain'],
  '.c': ['text/x-c', 'text/plain'],
  '.java': ['text/x-java', 'text/plain'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
  '.bmp': ['image/bmp'],
  '.svg': ['image/svg+xml'],
  '.pdf': ['application/pdf'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

async function validateUploadedFile(filePath, expectedExt) {
  const handle = await fs.promises.open(filePath, 'r')
  try {
    const { buffer } = await handle.read({ buffer: Buffer.alloc(4100), position: 0, length: 4100 })
    const type = await fileTypeFromBuffer(buffer)
    if (type) {
      const allowedMimes = EXT_MIME_MAP[expectedExt]
      if (!allowedMimes || !allowedMimes.includes(type.mime)) {
        return { valid: false, reason: `File content does not match expected .${expectedExt} extension` }
      }
    }
    return { valid: true }
  } finally {
    await handle.close()
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const name = Buffer.from(file.originalname, 'latin1').toString('utf8')
    cb(null, `${Date.now()}-${name}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed`))
    }
    cb(null, true)
  },
})

const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'starter_files', maxCount: 10 },
])

async function cleanupFiles(files) {
  if (!files) return
  const all = []
  if (files.file) all.push(...files.file)
  if (files.starter_files) all.push(...files.starter_files)
  for (const f of all) {
    try { await fs.promises.unlink(f.path) } catch { /* ok */ }
  }
}

const router = Router()

async function verifyClassroomOwnership(classroomId, userId) {
  const db = await getDb()
  const rows = queryRows(db, `SELECT id FROM classrooms WHERE id = ? AND teacher_id = ?`, [classroomId, userId])
  return rows.length > 0
}

async function checkAssignmentAccess(assignmentId, userId) {
  const db = await getDb()
  const rows = queryRows(db, `
    SELECT a.id, a.classroom_id, c.teacher_id FROM assignments a
    JOIN classrooms c ON c.id = a.classroom_id
    WHERE a.id = ?
  `, [assignmentId])
  if (rows.length === 0) return false
  const { classroom_id, teacher_id } = rows[0]
  if (teacher_id === Number(userId)) return true
  const enrolled = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [userId, classroom_id])
  return enrolled.length > 0
}

function parseStarterFiles(val) {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

router.get('/classrooms/:classroomId/assignments', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    if (!(await verifyClassroomOwnership(req.params.classroomId, req.user.id))) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const db = await getDb()
    const rows = queryRows(db, `
      SELECT id, title, description, due_date, language, starter_files, file_attachment, question_type, question_data, created_at, updated_at
      FROM assignments
      WHERE classroom_id = ?
      ORDER BY created_at DESC
    `, [req.params.classroomId])

    res.json(rows)
  } catch (err) {
    console.error('List assignments error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/classrooms/:classroomId/student-assignments', verifyToken, requireRole('student'), async (req, res) => {
  try {
    const db = await getDb()
    const enrolled = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, req.params.classroomId])
    if (enrolled.length === 0) {
      return res.status(403).json({ error: 'You are not enrolled in this classroom' })
    }

    const rows = queryRows(db, `
      SELECT a.id, a.title, a.description, a.due_date, a.language, a.starter_files, a.file_attachment, a.question_type, a.question_data, a.created_at,
        CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END as submitted,
        s.score
      FROM assignments a
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
      WHERE a.classroom_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id, req.params.classroomId])

    res.json(rows)
  } catch (err) {
    console.error('Student list assignments error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/classrooms/:classroomId/assignments', verifyToken, requireRole('teacher'), uploadLimiter, uploadFields, async (req, res) => {
  try {
    if (!(await verifyClassroomOwnership(req.params.classroomId, req.user.id))) {
      return res.status(404).json({ error: 'Classroom not found' })
    }

    const { title, description, due_date, language, question_type, question_data } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const fileAttachment = req.files?.file?.[0]?.filename || null
    const starterFiles = (req.files?.starter_files || []).map(f => f.filename)

    if (req.files?.file?.[0]) {
      const ext = path.extname(req.files.file[0].originalname).toLowerCase()
      const result = await validateUploadedFile(req.files.file[0].path, ext)
      if (!result.valid) {
        await cleanupFiles(req.files)
        return res.status(400).json({ error: result.reason })
      }
    }
    for (const sf of (req.files?.starter_files || [])) {
      const ext = path.extname(sf.originalname).toLowerCase()
      const result = await validateUploadedFile(sf.path, ext)
      if (!result.valid) {
        await cleanupFiles(req.files)
        return res.status(400).json({ error: `${sf.originalname}: ${result.reason}` })
      }
    }

    const db = await getDb()
    db.run(`
      INSERT INTO assignments (classroom_id, title, description, due_date, language, starter_files, file_attachment, question_type, question_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.params.classroomId, title.trim(), description || '', due_date || null, language || 'sql', JSON.stringify(starterFiles), fileAttachment || null, question_type || null, question_data || null])

    const rows = queryRows(db, `SELECT * FROM assignments WHERE id = last_insert_rowid()`)
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('Create assignment error:', err)
    cleanupFiles(req.files)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

router.put('/assignments/:id', verifyToken, requireRole('teacher'), uploadLimiter, uploadFields, async (req, res) => {
  try {
    const db = await getDb()
    const existing = queryRows(db, `
      SELECT a.* FROM assignments a
      JOIN classrooms c ON c.id = a.classroom_id
      WHERE a.id = ? AND c.teacher_id = ?
    `, [req.params.id, req.user.id])

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    const assignment = existing[0]
    const { title, description, due_date, language, question_type, question_data, empty_files } = req.body
    let fileAttachment = assignment.file_attachment

    if (req.files?.file?.[0]) {
      if (assignment.file_attachment) {
        fs.unlink(path.join(UPLOADS_DIR, assignment.file_attachment), () => {})
      }
      fileAttachment = req.files.file[0].filename
    }

    if (req.files?.file?.[0]) {
      const ext = path.extname(req.files.file[0].originalname).toLowerCase()
      const result = await validateUploadedFile(req.files.file[0].path, ext)
      if (!result.valid) {
        await cleanupFiles(req.files)
        return res.status(400).json({ error: result.reason })
      }
    }
    for (const sf of (req.files?.starter_files || [])) {
      const ext = path.extname(sf.originalname).toLowerCase()
      const result = await validateUploadedFile(sf.path, ext)
      if (!result.valid) {
        await cleanupFiles(req.files)
        return res.status(400).json({ error: `${sf.originalname}: ${result.reason}` })
      }
    }

    let starterFiles = parseStarterFiles(assignment.starter_files)
    if (req.files?.starter_files?.length > 0) {
      starterFiles.forEach(f => fs.unlink(path.join(UPLOADS_DIR, f), () => {}))
      starterFiles = req.files.starter_files.map(f => f.filename)
    }

    const finalQuestionType = question_type !== undefined ? question_type : assignment.question_type
    const finalQuestionData = question_data !== undefined ? question_data : assignment.question_data

    db.run(`
      UPDATE assignments
      SET title = ?,
          description = ?,
          due_date = ?,
          language = ?,
          starter_files = ?,
          file_attachment = ?,
          empty_files = ?,
          question_type = ?,
          question_data = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `, [
      title || assignment.title,
      description !== undefined ? description : assignment.description,
      due_date !== undefined ? (due_date || null) : (assignment.due_date || null),
      language || assignment.language,
      JSON.stringify(starterFiles),
      fileAttachment || null,
      empty_files !== undefined ? empty_files : null,
      finalQuestionType || null,
      finalQuestionData || null,
      req.params.id,
    ])

    const rows = queryRows(db, `SELECT * FROM assignments WHERE id = ?`, [req.params.id])
    res.json(rows[0])
  } catch (err) {
    console.error('Update assignment error:', err)
    cleanupFiles(req.files)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

router.delete('/assignments/:id', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const existing = queryRows(db, `
      SELECT a.* FROM assignments a
      JOIN classrooms c ON c.id = a.classroom_id
      WHERE a.id = ? AND c.teacher_id = ?
    `, [req.params.id, req.user.id])

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    const assignment = existing[0]
    if (assignment.file_attachment) {
      fs.unlink(path.join(UPLOADS_DIR, assignment.file_attachment), () => {})
    }
    parseStarterFiles(assignment.starter_files).forEach(f => {
      fs.unlink(path.join(UPLOADS_DIR, f), () => {})
    })

    db.run(`DELETE FROM assignments WHERE id = ?`, [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error('Delete assignment error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/assignments/:id/attachment', verifyToken, async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `SELECT * FROM assignments WHERE id = ?`, [req.params.id])

    if (rows.length === 0 || !rows[0].file_attachment) {
      return res.status(404).json({ error: 'Attachment not found' })
    }

    if (!(await checkAssignmentAccess(req.params.id, req.user.id))) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const filePath = path.join(UPLOADS_DIR, rows[0].file_attachment)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' })
    }

    res.download(filePath, rows[0].file_attachment.replace(/^\d+-/, ''))
  } catch (err) {
    console.error('Download attachment error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/assignments/:id/starter-files/:filename', verifyToken, async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `SELECT starter_files FROM assignments WHERE id = ?`, [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    if (!(await checkAssignmentAccess(req.params.id, req.user.id))) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const files = parseStarterFiles(rows[0].starter_files)
    const matched = files.find(f => f === req.params.filename || f.endsWith(`/${req.params.filename}`))

    if (!matched) {
      return res.status(404).json({ error: 'File not found' })
    }

    const filePath = path.join(UPLOADS_DIR, matched)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' })
    }

    res.download(filePath, matched.replace(/^\d+-/, ''))
  } catch (err) {
    console.error('Download starter file error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/assignments/:id', verifyToken, async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `SELECT * FROM assignments WHERE id = ?`, [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    if (!(await checkAssignmentAccess(req.params.id, req.user.id))) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('Get assignment error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/assignments/:id/submit', verifyToken, requireRole('student'), async (req, res) => {
  try {
    const db = await getDb()
    const { answer } = req.body
    if (answer === undefined || answer === null) {
      return res.status(400).json({ error: 'Answer is required' })
    }

    const assignment = queryRows(db, `SELECT id, classroom_id FROM assignments WHERE id = ?`, [req.params.id])
    if (assignment.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    const enrolled = queryRows(db, `SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?`, [req.user.id, assignment[0].classroom_id])
    if (enrolled.length === 0) {
      return res.status(403).json({ error: 'You are not enrolled in the classroom for this assignment' })
    }

    const answerText = typeof answer === 'string' ? answer : JSON.stringify(answer)
    db.run(
      `INSERT INTO submissions (assignment_id, student_id, answer)
       VALUES (?, ?, ?)
       ON CONFLICT(assignment_id, student_id) DO UPDATE SET answer = ?, submitted_at = datetime('now')`,
      [req.params.id, req.user.id, answerText, answerText]
    )

    const rows = queryRows(db, `SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?`, [req.params.id, req.user.id])
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('Submit answer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/assignments/:id/my-submission', verifyToken, requireRole('student'), async (req, res) => {
  try {
    const db = await getDb()
    const rows = queryRows(db, `SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?`, [req.params.id, req.user.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No submission found' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('Get my submission error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/assignments/:id/submissions', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const existing = queryRows(db, `
      SELECT a.* FROM assignments a
      JOIN classrooms c ON c.id = a.classroom_id
      WHERE a.id = ? AND c.teacher_id = ?
    `, [req.params.id, req.user.id])

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    const rows = queryRows(db, `
      SELECT s.id, s.answer, s.submitted_at, s.score, s.feedback, u.id AS student_id, u.name, u.email
      FROM submissions s
      JOIN users u ON u.id = s.student_id
      WHERE s.assignment_id = ?
      ORDER BY u.name
    `, [req.params.id])

    res.json(rows)
  } catch (err) {
    console.error('List submissions error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/assignments/:id/submissions/:studentId/grade', verifyToken, requireRole('teacher'), async (req, res) => {
  try {
    const db = await getDb()
    const { score, feedback } = req.body

    if (score !== undefined && (score === null || score < 0 || !Number.isInteger(Number(score)))) {
      return res.status(400).json({ error: 'Score must be a non-negative integer' })
    }
    if (feedback !== undefined && typeof feedback !== 'string') {
      return res.status(400).json({ error: 'Feedback must be a string' })
    }

    const ownership = queryRows(db, `
      SELECT a.id FROM assignments a
      JOIN classrooms c ON c.id = a.classroom_id
      WHERE a.id = ? AND c.teacher_id = ?
    `, [req.params.id, req.user.id])
    if (ownership.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' })
    }

    const updates = []
    const params = []
    if (score !== undefined) { updates.push('score = ?'); params.push(score !== null ? Number(score) : null) }
    if (feedback !== undefined) { updates.push('feedback = ?'); params.push(feedback) }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Provide score or feedback to update' })
    }

    params.push(req.params.id, req.params.studentId)
    db.run(`UPDATE submissions SET ${updates.join(', ')} WHERE assignment_id = ? AND student_id = ?`, params)

    const rows = queryRows(db, `SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?`, [req.params.id, req.params.studentId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('Grade submission error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/question-image', verifyToken, requireRole('teacher'), uploadLimiter, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' })

  const ext = path.extname(req.file.originalname).toLowerCase()
  const result = await validateUploadedFile(req.file.path, ext)
  if (!result.valid) {
    fs.unlink(req.file.path, () => {})
    return res.status(400).json({ error: result.reason })
  }

  res.json({ filename: req.file.filename })
})

router.get('/uploads/:filename', verifyToken, async (req, res) => {
  try {
    const filename = req.params.filename
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    const db = await getDb()
    const refs = queryRows(db, `
      SELECT a.id FROM assignments a
      WHERE a.file_attachment = ?
      UNION
      SELECT a.id FROM assignments a
      WHERE a.starter_files LIKE ?
    `, [filename, `%"${filename}"%`])
    if (refs.length > 0) {
      let allowed = false
      for (const r of refs) {
        if (await checkAssignmentAccess(r.id, req.user.id)) { allowed = true; break }
      }
      if (!allowed) return res.status(403).json({ error: 'Access denied' })
    }

    const filePath = path.join(UPLOADS_DIR, filename)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes = {
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.gif': 'image/gif', '.webp': 'image/webp', '.bmp': 'image/bmp', '.svg': 'image/svg+xml',
    }
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    res.sendFile(filePath)
  } catch (err) {
    console.error('Serve upload error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
