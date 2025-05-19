import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, getCurrentUser } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email, password) => {
    const response = await loginUser({ email, password })
    localStorage.setItem('token', response.token)
    setUser(response)
  }

  const register = async (userData) => {
    const response = await registerUser(userData)
    localStorage.setItem('token', response.token)
    setUser(response)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

<<<<<<< HEAD
export const useAuth = () => useContext(AuthContext)
=======
export const useAuth = () => useContext(AuthContext)
>>>>>>> cb52b1ae345687f1e37bb6e874684c6dd5f6046a
