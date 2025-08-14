import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    // Redirect to login if no token found
    return <Navigate to="/auth/login" replace />
  }
  
  // Render the protected component if token exists
  return children
}

export default ProtectedRoute