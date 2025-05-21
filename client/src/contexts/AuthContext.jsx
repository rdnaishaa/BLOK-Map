import { createContext, useState, useEffect } from 'react'
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser as apiLogoutUser,
} from '../services/auth_api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err) {
        console.error('Gagal memuat data user:', err)
        apiLogoutUser()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  const login = async (email, password) => {
    const payload = await loginUser({ email, password })
    localStorage.setItem('token', payload.token)
    setUser({
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      first_name: payload.first_name,
      last_name: payload.last_name,
    })
  }

  const register = async (userData) => {
    const payload = await registerUser(userData)
    localStorage.setItem('token', payload.token)
    setUser({
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      first_name: payload.first_name,
      last_name: payload.last_name,
    })
  }

  const logout = () => {
    apiLogoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
