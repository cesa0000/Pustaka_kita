import { createContext, useContext, useEffect, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pulihkan sesi dari token yang tersimpan
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false)
      return
    }
    api.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const login = async (email, password) =>
    saveSession((await api.post('/login', { email, password })).data)

  const register = async (form) =>
    saveSession((await api.post('/register', form)).data)

  const logout = async () => {
    try { await api.post('/logout') } catch { /* token sudah tidak valid */ }
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
