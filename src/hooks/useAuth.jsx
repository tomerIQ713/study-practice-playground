import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = '/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const tokenRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    tokenRef.current = data.token
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (name, email, password, role) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    tokenRef.current = data.token
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    tokenRef.current = null
    setUser(null)
  }, [])

  const getToken = useCallback(() => {
    return tokenRef.current
  }, [])

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { ...options.headers }
    if (tokenRef.current) {
      headers['Authorization'] = `Bearer ${tokenRef.current}`
    }
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(options.body)
    }
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers, credentials: 'include' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getToken, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
