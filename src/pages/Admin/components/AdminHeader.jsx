import { useNavigate } from 'react-router-dom'

const AdminHeader = ({ userName }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    navigate('/auth/login')
  }

  const handleBackToHomepage = () => {
    navigate('/commerce-dashboard')
  }

  return (
    <div className="admin-header">
      <h1>Admin Dashboard</h1>
      <div className="header-buttons">
        <button className="back-button" onClick={handleBackToHomepage}>
          🏠 Homepage
        </button>
        <button className="logout-button" onClick={handleLogout}>
          🔑 Logout
        </button>
      </div>
    </div>
  )
}

export default AdminHeader