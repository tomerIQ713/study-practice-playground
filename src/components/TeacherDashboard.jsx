import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './TeacherDashboard.css'

export default function TeacherDashboard() {
  const { user, authFetch, logout } = useAuth()
  const navigate = useNavigate()
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  function fetchClassrooms() {
    authFetch('/classrooms')
      .then(data => setClassrooms(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user || user.role !== 'teacher') return
    setLoading(true) // eslint-disable-line react-hooks/set-state-in-effect
    fetchClassrooms()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!user || user.role !== 'teacher') {
    return (
      <div className="teacher-dashboard">
        <Link to="/" className="teacher-dashboard__back">← Back</Link>
        <div className="teacher-dashboard__body">
          <p>Please log in as a teacher to view this page.</p>
          <Link to="/teacher" className="teacher-dashboard__link">Go to login</Link>
        </div>
      </div>
    )
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreateError('')
    if (!name.trim()) {
      setCreateError('Classroom name is required')
      return
    }
    setCreating(true)
    try {
      await authFetch('/classrooms', {
        method: 'POST',
        body: { name: name.trim() },
      })
      setName('')
      setShowForm(false)
      fetchClassrooms()
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__top">
          <Link to="/" className="teacher-dashboard__back">← Back</Link>
          <div className="teacher-dashboard__top-right">
            <span className="teacher-dashboard__user">{user.name}</span>
            <button className="teacher-dashboard__logout" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      <div className="teacher-dashboard__body">
        <h2 className="teacher-dashboard__title">Teacher Dashboard</h2>
        <p className="teacher-dashboard__desc">Create a classroom to start assigning exercises to your students.</p>

        {!showForm ? (
          <button className="teacher-dashboard__create" onClick={() => setShowForm(true)}>
            + Create a classroom
          </button>
        ) : (
          <form className="teacher-dashboard__form" onSubmit={handleCreate}>
            <input
              className="teacher-dashboard__input"
              type="text"
              placeholder="Classroom name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              spellCheck={false}
            />
            {createError && <p className="teacher-dashboard__error">{createError}</p>}
            <div className="teacher-dashboard__form-actions">
              <button className="teacher-dashboard__submit" type="submit" disabled={creating}>
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button className="teacher-dashboard__cancel" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="teacher-dashboard__classrooms">
          {loading ? (
            <p className="teacher-dashboard__status">Loading classrooms…</p>
          ) : error ? (
            <p className="teacher-dashboard__error">{error}</p>
          ) : classrooms.length === 0 ? (
            <p className="teacher-dashboard__status">No classrooms yet. Create one above!</p>
          ) : (
            <div className="teacher-dashboard__list">
              {classrooms.map(c => (
                <Link
                  key={c.id}
                  to={`/teacher/dashboard/classroom/${c.id}`}
                  className="teacher-dashboard__classroom-card"
                >
                  <span className="teacher-dashboard__classroom-name">{c.name}</span>
                  <span className="teacher-dashboard__classroom-code">Code: {c.code}</span>
                  <span className="teacher-dashboard__classroom-students">
                    {c.student_count ?? 0} student{(c.student_count ?? 0) !== 1 ? 's' : ''}
                  </span>
                  <span className="teacher-dashboard__classroom-arrow">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
