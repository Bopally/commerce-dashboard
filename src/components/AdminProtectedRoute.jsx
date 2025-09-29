import { Navigate } from 'react-router-dom'

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken')
  let userInfo = {}

  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  } catch (error) {
    console.error('Error parsing userInfo from localStorage:', error)
    return <Navigate to="/auth/login" replace />
  }

  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  if (userInfo.role !== 'admin') {
    return <Navigate to="/commerce-dashboard" replace />
  }

  return children
}

export default AdminProtectedRoute