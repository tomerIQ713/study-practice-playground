import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import authRoutes from './routes/auth.js'
import classroomRoutes from './routes/classrooms.js'
import assignmentRoutes from './routes/assignments.js'
import messageRoutes from './routes/messages.js'
import { getDb } from './db/connection.js'
import { authLimiter, apiLimiter } from './middleware/rateLimit.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('FATAL: Set a strong JWT_SECRET (>=16 chars) in server/.env or production environment')
  process.exit(1)
}

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3001

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "blob:"],
      workerSrc: ["'self'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authLimiter)
app.use('/api/auth', authRoutes)

app.use('/api', (req, res, next) => {
  if (req.originalUrl.startsWith('/api/auth')) return next()
  return apiLimiter(req, res, next)
})

app.use('/api/classrooms', classroomRoutes)
app.use('/api', assignmentRoutes)
app.use('/api', messageRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(express.static(path.join(__dirname, '..', 'dist')))
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  const message = err instanceof multer.MulterError ? err.message
    : 'Internal server error'
  res.status(err.status || 500).json({ error: message })
})
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

async function start() {
  await getDb()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
