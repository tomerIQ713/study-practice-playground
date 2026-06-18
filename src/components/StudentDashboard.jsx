import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './StudentDashboard.css'

export default function StudentDashboard() {
  const { user, authFetch, logout } = useAuth()
  const navigate = useNavigate()
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'student') return
    authFetch('/classrooms/my')
      .then(data => setClassrooms(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [user]) // eslint-disable-line

  if (!user || user.role !== 'student') {
    return (
      <div className="student-dashboard">
        <Link to="/" className="student-dashboard__back">← Back</Link>
        <div className="student-dashboard__body">
          <p>Please log in as a student to view this page.</p>
          <Link to="/student" className="student-dashboard__link">Go to login</Link>
        </div>
      </div>
    )
  }

  async function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="student-dashboard">
      <div className="student-dashboard__top">
        <Link to="/" className="student-dashboard__back">← Back</Link>
        <div className="student-dashboard__top-right">
          <span className="student-dashboard__user">{user.name}</span>
          <button className="student-dashboard__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
      <div className="student-dashboard__body">
        <h2 className="student-dashboard__title">Student Dashboard</h2>
        <p className="student-dashboard__desc">
          Welcome, {user.name}! Here are your classrooms.
        </p>

        <div className="student-dashboard__links">
          <Link to="/free" className="student-dashboard__action">
            Start Free Practice →
          </Link>
          <Link to="/student" className="student-dashboard__action">
            Join Another Class →
          </Link>
        </div>

        <div className="student-dashboard__classrooms">
          <h3 className="student-dashboard__section-title">Your Classrooms</h3>
          {loading ? (
            <p className="student-dashboard__status">Loading classrooms…</p>
          ) : error ? (
            <p className="student-dashboard__error">{error}</p>
          ) : classrooms.length === 0 ? (
            <p className="student-dashboard__status">You haven't joined any classrooms yet.</p>
          ) : (
            <div className="student-dashboard__list">
              {classrooms.map(c => (
                <Link key={c.id} to={`/student/dashboard/classroom/${c.id}`} className="student-dashboard__classroom-card">
                  <span className="student-dashboard__classroom-name">{c.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
