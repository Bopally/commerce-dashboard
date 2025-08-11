import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchData } from '../../services/api.service'
import CartCard from '../../components/CartCard'
import CartSummary from '../../components/CartSummary'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
} from '../../components/LoadingStates'
import './UserProfile.css'

const UserProfile = ({ handlers }) => {
  const { id } = useParams()
  const [viewMode, setViewMode] = useState('detailed')
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [userError, setUserError] = useState(null)

  // Get cart data from lifted state via props
  const { getUserCarts, isUserCartsLoading, getUserCartsError, loadUserCarts } =
    handlers || {}

  // Load specific user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        setUserLoading(true)
        setUserError(null)
        const data = await fetchData(`users/${id}`)
        setUser(data)

        // Also load user carts using lifted state
        if (loadUserCarts) {
          loadUserCarts()
        }
      } catch (err) {
        setUserError(err.message)
      } finally {
        setUserLoading(false)
      }
    }

    if (id) {
      loadUser()
    }
  }, [id, loadUserCarts])

  // Get carts data from lifted state
  const carts = getUserCarts ? getUserCarts(id) : []
  const cartsLoading = isUserCartsLoading ? isUserCartsLoading() : false
  const cartsError = getUserCartsError ? getUserCartsError() : null

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
          <div className="carts-header">
            <h2 className="carts-title">🛒 Shopping Carts ({carts.length})</h2>

            {carts.length > 0 && (
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${
                    viewMode === 'detailed' ? 'active' : ''
                  }`}
                  onClick={() => setViewMode('detailed')}
                >
                  📋 Detailed
                </button>
                <button
                  className={`toggle-btn ${
                    viewMode === 'summary' ? 'active' : ''
                  }`}
                  onClick={() => setViewMode('summary')}
                >
                  📊 Summary
                </button>
              </div>
            )}
          </div>

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
            <div
              className={
                viewMode === 'summary' ? 'carts-summary-grid' : 'carts-grid'
              }
            >
              {carts.map((cart) =>
                viewMode === 'summary' ? (
                  <CartSummary key={cart.id} cart={cart} />
                ) : (
                  <CartCard key={cart.id} cart={cart} />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
