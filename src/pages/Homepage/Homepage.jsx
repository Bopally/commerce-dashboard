import { Link, Outlet } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'
import { NetworkStatus } from '../../components/LoadingStates'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

function Header() {
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
        <Link to="/commerce-dashboard/favorites" className="nav-link">
          💗 Favorites ({favorites.length})
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default Header
