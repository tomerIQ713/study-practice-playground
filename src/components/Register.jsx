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
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    if (password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setBusy(true)
    try {
      const user = await register(name.trim(), email.trim(), password, role)
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student')
    } catch (err) {
      setErrors({ general: err.message })
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
            className={'register__input' + (errors.name ? ' register__input--error' : '')}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            autoComplete="name"
            spellCheck={false}
          />
          {errors.name && <p className="register__field-error">{errors.name}</p>}
          <input
            className={'register__input' + (errors.email ? ' register__input--error' : '')}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            autoComplete="email"
            spellCheck={false}
          />
          {errors.email && <p className="register__field-error">{errors.email}</p>}
          <input
            className={'register__input' + (errors.password ? ' register__input--error' : '')}
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            autoComplete="new-password"
          />
          {errors.password && <p className="register__field-error">{errors.password}</p>}
          <select className="register__select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">I'm a student</option>
            <option value="teacher">I'm a teacher</option>
          </select>

          {errors.general && <p className="register__error">{errors.general}</p>}

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
