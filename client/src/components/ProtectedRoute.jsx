import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute