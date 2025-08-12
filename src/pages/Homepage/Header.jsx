import { Link, Outlet } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'
import { NetworkStatus } from '../../components/LoadingStates'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

function Homepage() {
  const { favorites } = useFavorites()
  const isOnline = useNetworkStatus()

  return (
    <div>
      <NetworkStatus isOnline={isOnline} />
      {/* Navigation */}
      <nav className="main-nav">
        <Link to="/" className="nav-link">
          🏠 Homepage
        </Link>
        <Link to="/commerce-dashboard/users" className="nav-link">
          👥 Users
        </Link>
        <Link to="/commerce-dashboard/favorites" className="nav-link">
          💗 Favorites ({favorites.length})
        </Link>
        <Link to="/auth/login" className="nav-link">
          🔐 Login
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default Homepage
