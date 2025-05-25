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
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsLogin(true)
      setLoading(false)
      return
    }
    
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          const userWithRole = { 
            ...userData, 
            isAdmin: userData.role === 'admin',
            role: userData.role // pastikan role selalu ada
          }
          setUser(userWithRole)
          setIsLogin(true)
          localStorage.setItem('user', JSON.stringify(userWithRole))
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
      const userWithRole = { 
        ...userData, 
        isAdmin: userData.role === 'admin',
        role: userData.role // pastikan role selalu ada
      }
      setUser(userWithRole)
      setIsLogin(true)
      localStorage.setItem('user', JSON.stringify(userWithRole))
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const newUser = await registerUser(userData)
      const userWithRole = { 
        ...newUser, 
        isAdmin: newUser.role === 'admin',
        role: newUser.role // pastikan role selalu ada
      }
      setUser(userWithRole)
      setIsLogin(true)
      localStorage.setItem('user', JSON.stringify(userWithRole))
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