import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Register.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('All fields required, password at least 6 characters')
      return
    }
    setBusy(true)
    try {
      const user = await register(name.trim(), email.trim(), password, role)
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="register">
      <Link to="/" className="register__back">← Back</Link>
      <div className="register__body">
        <h2 className="register__title">Create an Account</h2>
        <p className="register__desc">Sign up to get started with your classrooms.</p>

        <form className="register__form" onSubmit={handleSubmit}>
          <input
            className="register__input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            spellCheck={false}
          />
          <input
            className="register__input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            spellCheck={false}
          />
          <input
            className="register__input"
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <select className="register__select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">I'm a student</option>
            <option value="teacher">I'm a teacher</option>
          </select>

          {error && <p className="register__error">{error}</p>}

          <button className="register__submit" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="register__footer">
          Already have an account? <Link to="/teacher" className="register__link">Log in</Link>
        </p>
      </div>
    </div>
  )
}
