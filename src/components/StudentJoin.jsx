import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './StudentJoin.css'

export default function StudentJoin() {
  const { login, authFetch, user, logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [classrooms, setClassrooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.resolve().then(() => setLoadingRooms(true))
    authFetch('/classrooms/my')
      .then(setClassrooms)
      .catch(() => setClassrooms([]))
      .finally(() => setLoadingRooms(false))
  }, [user]) // eslint-disable-line

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    if (!email.trim() || !password) {
      setLoginError('Please enter email and password')
      return
    }
    setLoginBusy(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoginBusy(false)
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    setError('')
    let cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      setError('Please enter a class code')
      return
    }
    setBusy(true)
    try {
      await authFetch('/classrooms/join', {
        method: 'POST',
        body: { code: cleanCode },
      })
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="student-join">
      <div className="student-join__top">
          <Link to="/" className="student-join__back">← Back</Link>
          {user && (
            <div className="student-join__top-right">
              <span className="student-join__user">{user.name}</span>
              <button className="student-join__logout" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      <div className="student-join__body">
        <h2 className="student-join__title">Join a Classroom</h2>
        {!user ? (
          showLogin ? (
            <>
              <p className="student-join__desc">Log in to join a classroom.</p>
              <form className="student-join__form" onSubmit={handleLogin}>
                <input
                  className="student-join__input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  spellCheck={false}
                />
                <input
                  className="student-join__input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                {loginError && <p className="student-join__error">{loginError}</p>}
                <button className="student-join__submit" type="submit" disabled={loginBusy}>
                  {loginBusy ? 'Logging in…' : 'Login'}
                </button>
              </form>
              <p className="student-join__hint">
                Don't have an account?{' '}
                <button className="student-join__link-btn" onClick={() => setShowLogin(false)}>
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="student-join__desc">Create an account to join a classroom.</p>
              <Link to="/register" className="student-join__link">Register here</Link>
              <p className="student-join__hint">
                Already have one?{' '}
                <button className="student-join__link-btn" onClick={() => setShowLogin(true)}>
                  Log in
                </button>
              </p>
            </>
          )
        ) : (
          <>
            <div className="student-join__section">
              <h3 className="student-join__section-title">Your Classrooms</h3>
              {loadingRooms ? (
                <p className="student-join__desc">Loading…</p>
              ) : classrooms.length === 0 ? (
                <p className="student-join__desc">You haven't joined any classrooms yet.</p>
              ) : (
                <ul className="student-join__list">
                  {classrooms.map((c) => (
                    <li key={c.id} className="student-join__list-item">
                      <Link to={`/student/dashboard/classroom/${c.id}`} className="student-join__list-link">
                        <span className="student-join__list-name">{c.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="student-join__section">
              <h3 className="student-join__section-title">Join a New Class</h3>
              <p className="student-join__desc">
                {user.role === 'student'
                  ? 'Enter the code your teacher gave you.'
                  : 'Enter a class code to join as a student.'}
              </p>
              <form className="student-join__form" onSubmit={handleJoin}>
                <input
                  className="student-join__input"
                  type="text"
                  placeholder="Enter class code..."
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={6}
                />
                {error && <p className="student-join__error">{error}</p>}
                <button className="student-join__submit" type="submit" disabled={busy}>
                  {busy ? 'Joining…' : 'Join'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
