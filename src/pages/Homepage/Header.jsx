import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'
import { NetworkStatus } from '../../components/LoadingStates'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useState, useEffect } from 'react'

function Homepage() {
  const { favorites } = useFavorites()
  const isOnline = useNetworkStatus()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    setIsLoggedIn(!!token)
    setUserName(userInfo.username || userInfo.firstName || 'User')
    setUserRole(userInfo.role || '')
    setUserId(userInfo.id || null)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    setIsLoggedIn(false)
    setUserName('')
    setUserRole('')
    setUserId(null)
    navigate('/commerce-dashboard')
  }

  return (
    <div>
      <NetworkStatus isOnline={isOnline} />
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-left">
          <Link to="/" className="nav-link">
            🏠 Homepage
          </Link>
          <Link to="/commerce-dashboard/users" className="nav-link">
            👥 Users
          </Link>
          <Link to="/commerce-dashboard/favorites" className="nav-link">
            💗 Favorites ({favorites.length})
          </Link>
          {isLoggedIn && userRole === 'user' && (
            <Link to={`/commerce-dashboard/my-carts`} className="nav-link">
              🛒 My Carts
            </Link>
          )}
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <Link to="/auth/login" className="nav-link">
              🔐 Login
            </Link>
          ) : (
            <>
              {userRole === 'admin' && (
                <Link to="/admin" className="nav-link">
                  ⚙️ Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                🔑 Logout ({userName}) -{' '}
                {userRole === 'admin' ? 'Admin' : 'User'}
              </button>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

export default Homepage
