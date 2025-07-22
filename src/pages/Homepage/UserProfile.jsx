import { useParams, Link } from 'react-router-dom'
import { useUser } from '../../assets/hooks/useUser'
import { useUserCarts } from '../../assets/hooks/useUserCarts'
import CartCard from '../../components/CartCard'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
} from '../../components/LoadingStates'
import './UserProfile.css'

const UserProfile = () => {
  const { id } = useParams()
  const { user, loading: userLoading, error: userError } = useUser(id)
  const { carts, loading: cartsLoading, error: cartsError } = useUserCarts(id)

  // Loading state
  if (userLoading) {
    return (
      <div className="user-profile">
        <Link to="/commerce-dashboard/users" className="back-btn">
          ← Back to Users
        </Link>
        <LoadingSpinner message="Loading user profile..." />
      </div>
    )
  }

  // Error state
  if (userError) {
    return (
      <div className="user-profile">
        <Link to="/commerce-dashboard/users" className="back-btn">
          ← Back to Users
        </Link>
        <ErrorState error={userError} title="Failed to load user profile" />
      </div>
    )
  }

  // User not found state
  if (!user) {
    return (
      <div className="user-profile">
        <Link to="/commerce-dashboard/users" className="back-btn">
          ← Back to Users
        </Link>
        <EmptyState
          icon="👤"
          title="User not found"
          message="The user you're looking for doesn't exist or has been removed."
        />
      </div>
    )
  }

  return (
    <div className="user-profile">
      <Link to="/commerce-dashboard/users" className="back-btn">
        ← Back to Users
      </Link>

      <div className="user-profile__container">
        {/* User Details Section */}
        <div className="user-profile__header">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="user-profile-avatar"
          />
          <div className="user-profile-info">
            <h1 className="user-profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="user-profile-email">{user.email}</p>
            <div className="user-profile-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-icon">📱</span>
                  <span className="detail-text">{user.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎂</span>
                  <span className="detail-text">{user.age} years old</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👤</span>
                  <span className="detail-text">{user.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🩸</span>
                  <span className="detail-text">{user.bloodGroup}</span>
                </div>
                {user.address && (
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">
                      {user.address.city}, {user.address.state}
                    </span>
                  </div>
                )}
                {user.company && (
                  <div className="detail-item">
                    <span className="detail-icon">💼</span>
                    <span className="detail-text">
                      {user.company.title} at {user.company.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Carts Section */}
        <div className="user-carts-section">
          <h2 className="carts-title">🛒 Shopping Carts ({carts.length})</h2>

          {cartsLoading ? (
            <LoadingSpinner message="Loading user carts..." />
          ) : cartsError ? (
            <ErrorState error={cartsError} title="Failed to load user carts" />
          ) : carts.length === 0 ? (
            <EmptyState
              icon="🛒"
              title="No carts found"
              message="This user hasn't created any shopping carts yet."
            />
          ) : (
            <div className="carts-grid">
              {carts.map((cart) => (
                <CartCard key={cart.id} cart={cart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
