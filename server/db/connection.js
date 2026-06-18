import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data.sqlite')
const SCHEMA_PATH = process.env.SCHEMA_PATH || path.join(__dirname, 'schema.sql')

let db = null

export async function getDb() {
  if (db) return db

  const SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
  db.run(schema)

  db.run('PRAGMA foreign_keys = ON')

  try { db.run("ALTER TABLE assignments ADD COLUMN starter_files TEXT DEFAULT '[]'") } catch {}
  try { db.run("ALTER TABLE messages ADD COLUMN assignment_id INTEGER REFERENCES assignments(id)") } catch {}
  try { db.run("ALTER TABLE assignments ADD COLUMN question_type TEXT") } catch {}
  try { db.run("ALTER TABLE assignments ADD COLUMN question_data TEXT") } catch {}
  try { db.run("CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, assignment_id INTEGER NOT NULL REFERENCES assignments(id), student_id INTEGER NOT NULL REFERENCES users(id), answer TEXT NOT NULL, submitted_at TEXT DEFAULT (datetime('now')), UNIQUE(assignment_id, student_id))") } catch {}
  try { db.run("ALTER TABLE assignments ADD COLUMN empty_files TEXT DEFAULT '[]'") } catch {}
  try { db.run("ALTER TABLE submissions ADD COLUMN score INTEGER") } catch {}
  try { db.run("ALTER TABLE submissions ADD COLUMN feedback TEXT") } catch {}

  try { db.run('CREATE INDEX IF NOT EXISTS idx_enrollments_classroom ON enrollments(classroom_id)') } catch {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id)') } catch {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON assignments(classroom_id)') } catch {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id)') } catch {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id)') } catch {}
  try { db.run('CREATE INDEX IF NOT EXISTS idx_messages_classroom ON messages(classroom_id)') } catch {}

  persistPeriodically()
  return db
}

let persistTimer = null

function persistPeriodically() {
  if (persistTimer) clearInterval(persistTimer)
  persistTimer = setInterval(() => {
    if (db) {
      const data = db.export()
      const buffer = Buffer.from(data)
      fs.writeFileSync(DB_PATH, buffer)
    }
  }, 5000)
}

export function persistDb() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(DB_PATH, buffer)
  }
}

process.on('exit', () => {
  if (persistTimer) clearInterval(persistTimer)
  persistDb()
})
process.on('SIGINT', () => {
  persistDb()
  process.exit(0)
})
process.on('SIGTERM', () => {
  persistDb()
  process.exit(0)
})
