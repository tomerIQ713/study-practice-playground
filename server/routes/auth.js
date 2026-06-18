import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDb } from '../db/connection.js'
import { verifyToken } from '../middleware/auth.js'
import { queryRows } from '../db/utils.js'

const router = Router()

function getJwtSecret() {
  return process.env.JWT_SECRET
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Role must be teacher or student' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const db = await getDb()

    const existing = queryRows(db, `SELECT id FROM users WHERE email = ?`, [email])
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    db.run(`INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`, [name, email, password_hash, role])

    const rows = queryRows(db, `SELECT * FROM users WHERE email = ?`, [email])
    const user = rows[0]

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, getJwtSecret(), { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    })

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const db = await getDb()
    const rows = queryRows(db, `SELECT * FROM users WHERE email = ?`, [email])

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)

    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, getJwtSecret(), { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    })

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' })
  res.json({ ok: true })
})

router.get('/me', verifyToken, (req, res) => {
  res.json(req.user)
})

export default router
