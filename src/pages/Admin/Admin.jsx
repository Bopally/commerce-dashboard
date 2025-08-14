import { useNavigate } from 'react-router-dom'
import './Admin.css'

const Admin = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/auth/login')
  }

  const token = localStorage.getItem('authToken')

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="admin-content">
        <div className="admin-card">
          <h2>Welcome to Admin Panel</h2>
          <p>You have successfully accessed the protected admin area!</p>
          
          <div className="admin-info">
            <h3>System Information</h3>
            <p><strong>Authentication:</strong> JWT Token Active</p>
            <p><strong>Token Preview:</strong> {token ? `${token.substring(0, 20)}...` : 'No token found'}</p>
            <p><strong>Access Level:</strong> Administrator</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Admin