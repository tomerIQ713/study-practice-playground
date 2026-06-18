import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ClassroomChat from './ClassroomChat'
import AssignmentPlayground from './AssignmentPlayground'
import { parseStarterFiles, parseEmptyFiles, fixMojibake, LANG_LABELS } from '../utils/parsers'
import './StudentClassroom.css'

export default function StudentClassroom() {
  const { classroomId } = useParams()
  const { authFetch, user, logout } = useAuth()
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [assignments, setAssignments] = useState([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [answerAssignmentId, setAnswerAssignmentId] = useState(null)
  const [activeTab, setActiveTab] = useState('roster')

  async function handleDownload(url, filename) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const objUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objUrl
      a.download = filename
      a.click()
      URL.revokeObjectURL(objUrl)
    } catch {
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.target = '_blank'
      a.click()
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'student') return
    authFetch(`/classrooms/${classroomId}/roster`)
      .then(data => setClassroom(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [classroomId, user]) // eslint-disable-line

  useEffect(() => {
    if (!user || user.role !== 'student') return
    authFetch(`/classrooms/${classroomId}/student-assignments`)
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setAssignmentsLoading(false))
  }, [classroomId, user]) // eslint-disable-line

  async function handleLogout() {
    logout()
    navigate('/')
  }

  if (!user || user.role !== 'student') {
    return (
      <div className="student-classroom">
        <Link to="/" className="student-classroom__back">← Back</Link>
        <div className="student-classroom__body">
          <p>Please log in as a student to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="student-classroom">
        <Link to="/student/dashboard" className="student-classroom__back">← Back to dashboard</Link>
        <div className="student-classroom__body">
          <p>Loading classroom…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="student-classroom">
        <Link to="/student/dashboard" className="student-classroom__back">← Back to dashboard</Link>
        <div className="student-classroom__body">
          <p className="student-classroom__error">{error}</p>
        </div>
      </div>
    )
  }

  if (answerAssignmentId) {
    return (
      <AssignmentPlayground
        assignmentId={answerAssignmentId}
        onClose={() => setAnswerAssignmentId(null)}
      />
    )
  }

  if (!classroom) return null

  return (
    <div className="student-classroom">
      <div className="student-classroom__top">
        <Link to="/student/dashboard" className="student-classroom__back">← Back to dashboard</Link>
        <div className="student-classroom__top-right">
          {user && <span className="student-classroom__user">{user.name}</span>}
          <button className="student-classroom__logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div className="student-classroom__tabs">
        <button
          className={`student-classroom__tab${activeTab === 'roster' ? ' student-classroom__tab--active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          Roster
        </button>
        <button
          className={`student-classroom__tab${activeTab === 'assignments' ? ' student-classroom__tab--active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`student-classroom__tab${activeTab === 'completed' ? ' student-classroom__tab--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <div className="student-classroom__body">
        <div className="student-classroom__header">
          <h2 className="student-classroom__title">{classroom.name}</h2>
          <p className="student-classroom__teacher">Teacher: {classroom.teacher_name}</p>
        </div>

        {activeTab === 'roster' && (
          <div className="student-classroom__students">
            <h3 className="student-classroom__students-title">
              Enrolled Students ({classroom.students?.length || 0})
            </h3>

            {(!classroom.students || classroom.students.length === 0) ? (
              <p className="student-classroom__empty">No students have joined yet.</p>
            ) : (
              <table className="student-classroom__table">
                <thead>
                  <tr>
                    <th className="student-classroom__th">Name</th>
                    <th className="student-classroom__th">Email</th>
                    <th className="student-classroom__th">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {classroom.students.map(s => (
                    <tr key={s.id}>
                      <td className="student-classroom__td">{s.name}</td>
                      <td className="student-classroom__td">{s.email}</td>
                      <td className="student-classroom__td">{s.joined_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {(activeTab === 'assignments' || activeTab === 'completed') && (
          <div className="student-classroom__assignments">
            {assignmentsLoading ? (
              <p className="student-classroom__empty">Loading assignments…</p>
            ) : assignments.length === 0 ? (
              <p className="student-classroom__empty">No assignments yet.</p>
            ) : (
              <>
                {(() => {
                  const pending = assignments.filter(a => !a.submitted)
                  const completed = assignments.filter(a => a.submitted)
                  return (
                    <>
                      {activeTab === 'completed' && completed.length > 0 && (
                        <div className="student-classroom__section">
                          <h4 className="student-classroom__section-title">Completed ✓</h4>
                          <div className="student-classroom__assignment-list">
                            {completed.map(a => <AssignmentCard key={a.id} a={a} setAnswerAssignmentId={setAnswerAssignmentId} isCompleted handleDownload={handleDownload} />)}
                          </div>
                        </div>
                      )}
                      {activeTab === 'completed' && completed.length === 0 && (
                        <p className="student-classroom__empty">No completed assignments yet.</p>
                      )}
                      {activeTab === 'assignments' && pending.length > 0 && (
                        <div className="student-classroom__section">
                          <h4 className="student-classroom__section-title">Pending</h4>
                          <div className="student-classroom__assignment-list">
                            {pending.map(a => <AssignmentCard key={a.id} a={a} setAnswerAssignmentId={setAnswerAssignmentId} handleDownload={handleDownload} />)}
                          </div>
                        </div>
                      )}
                      {activeTab === 'assignments' && pending.length === 0 && (
                        <p className="student-classroom__empty">No pending assignments.</p>
                      )}
                    </>
                  )
                })()}
              </>
            )}
          </div>
        )}
      </div>

      <ClassroomChat
        classroomId={classroomId}
        mode="student"
        students={classroom?.students}
        teacherName={classroom?.teacher_name}
        teacherId={classroom?.teacher_id}
        assignments={assignments}
        collapsed={!chatOpen}
        onToggle={() => setChatOpen(c => !c)}
      />
    </div>
  )
}

function AssignmentCard({ a, setAnswerAssignmentId, handleDownload, isCompleted }) {
  const starterFiles = parseStarterFiles(a.starter_files)
  const emptyFiles = parseEmptyFiles(a.empty_files)

  return (
    <div className={'student-classroom__assignment-card' + (isCompleted ? ' student-classroom__assignment-card--completed' : '')}>
      <div className="student-classroom__assignment-top">
        <span className="student-classroom__assignment-title">{a.title}</span>
        <span className="student-classroom__assignment-lang">{LANG_LABELS[a.language] || a.language}</span>
        {isCompleted && <span className="student-classroom__assignment-badge">✓</span>}
        {isCompleted && a.score != null && (
          <span className="student-classroom__score-badge">Score: {a.score}</span>
        )}
      </div>
      {a.due_date && (
        <p className="student-classroom__assignment-due">Due: {a.due_date}</p>
      )}
      {a.description && (
        <p className="student-classroom__assignment-desc">{a.description}</p>
      )}
      {emptyFiles.length > 0 && (
        <div className="student-classroom__assignment-empty">
          <span className="student-classroom__assignment-empty-label">Files to create:</span>
          <div className="student-classroom__assignment-empty-list">
            {emptyFiles.map((f, i) => (
              <span key={i} className="student-classroom__assignment-empty-file">{f}</span>
            ))}
          </div>
        </div>
      )}
      <div className="student-classroom__assignment-actions">
        {a.file_attachment && (
          <button
            className="student-classroom__assignment-file"
            onClick={() => handleDownload(`/api/assignments/${a.id}/attachment`, fixMojibake(a.file_attachment.replace(/^\d+-/, '')))}
          >
            {fixMojibake(a.file_attachment.replace(/^\d+-/, ''))}
          </button>
        )}
        {starterFiles.map((sf, i) => (
          <button
            key={i}
            className="student-classroom__assignment-file"
            onClick={() => handleDownload(`/api/assignments/${a.id}/starter-files/${encodeURIComponent(sf)}`, fixMojibake(sf.replace(/^\d+-/, '')))}
          >
            {fixMojibake(sf.replace(/^\d+-/, ''))}
          </button>
        ))}
        <button className="student-classroom__assignment-start" type="button" onClick={() => setAnswerAssignmentId(a.id)}>
          {isCompleted ? 'Review' : 'Start'}
        </button>
      </div>
    </div>
  )
}
