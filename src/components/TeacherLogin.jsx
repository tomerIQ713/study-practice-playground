import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './TeacherLogin.css'

export default function TeacherLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'teacher') {
      navigate('/teacher/dashboard', { replace: true })
    }
  }, [user, navigate])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter email and password')
      return
    }
    setBusy(true)
    try {
      const user = await login(email.trim(), password)
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/free')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="teacher-login">
      <Link to="/" className="teacher-login__back">← Back</Link>
      <div className="teacher-login__body">
        <h2 className="teacher-login__title">Teacher Login</h2>
        <p className="teacher-login__desc">Sign in to manage your classrooms and assignments.</p>
        <form className="teacher-login__form" onSubmit={handleSubmit}>
          <input
            className="teacher-login__input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            spellCheck={false}
          />
          <input
            className="teacher-login__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="teacher-login__error">{error}</p>}
          <button className="teacher-login__submit" type="submit" disabled={busy}>
            {busy ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="teacher-login__footer">
          Don't have an account? <Link to="/register" className="teacher-login__link">Register here</Link>
        </p>
      </div>
    </div>
  )
}
