import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import TeacherAssignments from './TeacherAssignments'
import TeacherSubmissions from './TeacherSubmissions'
import AssignmentPlayground from './AssignmentPlayground'
import ClassroomChat from './ClassroomChat'
import './TeacherClassroom.css'

export default function TeacherClassroom() {
  const { classroomId } = useParams()
  const { authFetch, user, logout } = useAuth()
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('assignments')
  const [previewSubmission, setPreviewSubmission] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'teacher') return
    setLoading(true) // eslint-disable-line react-hooks/set-state-in-effect
    authFetch(`/classrooms/${classroomId}`)
      .then(data => setClassroom(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [classroomId, user, authFetch])

  async function handleLogout() {
    logout()
    navigate('/')
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="teacher-classroom">
        <Link to="/" className="teacher-classroom__back">← Back</Link>
        <div className="teacher-classroom__body">
          <p>Please log in as a teacher to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="teacher-classroom">
        <Link to="/" className="teacher-classroom__back">← Back</Link>
        <div className="teacher-classroom__body">
          <p>Loading classroom…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="teacher-classroom">
        <Link to="/" className="teacher-classroom__back">← Back</Link>
        <div className="teacher-classroom__body">
          <p className="teacher-classroom__error">{error}</p>
        </div>
      </div>
    )
  }

  if (!classroom) return null

  if (previewSubmission) {
    return (
      <AssignmentPlayground
        assignmentId={previewSubmission.assignment.id}
        onClose={() => setPreviewSubmission(null)}
        preloadData={previewSubmission}
      />
    )
  }

  return (
    <div className="teacher-classroom">
      <div className="teacher-classroom__top">
        <Link to="/teacher/dashboard" className="teacher-classroom__back">← Back to dashboard</Link>
        <div className="teacher-classroom__top-right">
          <span className="teacher-classroom__user">{user.name}</span>
          <button className="teacher-classroom__logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>
      <div className="teacher-classroom__body">
        <div className="teacher-classroom__header">
          <h2 className="teacher-classroom__title">{classroom.name}</h2>
          <div className="teacher-classroom__code">
            Class code: <strong>{classroom.code}</strong>
          </div>
          <p className="teacher-classroom__hint">Share this code with your students to join.</p>
        </div>

        <div className="teacher-classroom__tabs">
          <button
            className={`teacher-classroom__tab${activeTab === 'roster' ? ' teacher-classroom__tab--active' : ''}`}
            onClick={() => setActiveTab('roster')}
          >
            Roster
          </button>
          <button
            className={`teacher-classroom__tab${activeTab === 'assignments' ? ' teacher-classroom__tab--active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button
            className={`teacher-classroom__tab${activeTab === 'submissions' ? ' teacher-classroom__tab--active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Student Answers
          </button>
        </div>

        {activeTab === 'roster' && (
          <div className="teacher-classroom__students">
            <h3 className="teacher-classroom__students-title">
              Students ({classroom.students?.length || 0})
            </h3>

            {(!classroom.students || classroom.students.length === 0) ? (
              <p className="teacher-classroom__empty">No students have joined yet.</p>
            ) : (
              <table className="teacher-classroom__table">
                <thead>
                  <tr>
                    <th className="teacher-classroom__th">Name</th>
                    <th className="teacher-classroom__th">Email</th>
                    <th className="teacher-classroom__th">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {classroom.students.map(s => (
                    <tr key={s.id}>
                      <td className="teacher-classroom__td">{s.name}</td>
                      <td className="teacher-classroom__td">{s.email}</td>
                      <td className="teacher-classroom__td">{s.joined_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'assignments' && <TeacherAssignments classroomId={classroomId} />}

        {activeTab === 'submissions' && <TeacherSubmissions classroomId={classroomId} onViewSubmission={setPreviewSubmission} />}
      </div>

      <ClassroomChat
        classroomId={classroomId}
        mode="teacher"
        students={classroom.students}
        assignments={null}
        collapsed={!chatOpen}
        onToggle={() => setChatOpen(c => !c)}
      />
    </div>
  )
}
