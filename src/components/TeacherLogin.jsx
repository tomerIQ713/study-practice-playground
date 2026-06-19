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
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!email.trim()) next.email = 'Email is required'
    if (!password) next.password = 'Password is required'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setBusy(true)
    try {
      const user = await login(email.trim(), password)
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/free')
    } catch (err) {
      setErrors({ general: err.message })
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
            className={'teacher-login__input' + (errors.email ? ' teacher-login__input--error' : '')}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            autoComplete="email"
            spellCheck={false}
          />
          {errors.email && <p className="teacher-login__field-error">{errors.email}</p>}
          <input
            className={'teacher-login__input' + (errors.password ? ' teacher-login__input--error' : '')}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            autoComplete="current-password"
          />
          {errors.password && <p className="teacher-login__field-error">{errors.password}</p>}
          {errors.general && <p className="teacher-login__error">{errors.general}</p>}
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
