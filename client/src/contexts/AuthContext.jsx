import { createContext, useState, useEffect } from 'react'
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser as apiLogoutUser,
} from '../services/auth_api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLogin(true)
      setLoading(false)
      return
    }
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser({ ...userData, isAdmin: userData.username === 'sbd' })
          setIsLogin(true)
          localStorage.setItem(
            'user',
            JSON.stringify({ ...userData, isAdmin: userData.username === 'sbd' })
          )
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const userData = await loginUser({ email, password })
      setUser({ ...userData, isAdmin: userData.username === 'sbd' })
      setIsLogin(true)
      localStorage.setItem(
        'user',
        JSON.stringify({ ...userData, isAdmin: userData.username === 'sbd' })
      )
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData)
      setUser({ ...newUser, isAdmin: newUser.username === 'sbd' })
      setIsLogin(true)
      localStorage.setItem(
        'user',
        JSON.stringify({ ...newUser, isAdmin: newUser.username === 'sbd' })
      )
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await apiLogoutUser()
      setUser(null)
      setIsLogin(false)
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    loading,
    isLogin,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider