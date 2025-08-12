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

/**
 * @typedef {import('../../types/interfaces.js').User} User
 * @typedef {import('../../types/interfaces.js').Cart} Cart
 */

/**
 * UserProfile component displays detailed information about a user and their shopping carts
 * @param {Object} props
 * @returns {JSX.Element}
 */

const UserProfile = () => {
  const { id } = useParams()
  /** @type {['detailed' | 'summary', function]} */
  const [viewMode, setViewMode] = useState('detailed')
  /** @type {[User | null, function]} */
  const [user, setUser] = useState(null)
  /** @type {[boolean, function]} */
  const [userLoading, setUserLoading] = useState(true)
  /** @type {[string | null, function]} */
  const [userError, setUserError] = useState(null)

  /** @type {[Cart[], function]} */
  const [userCarts, setUserCarts] = useState([])
  /** @type {[boolean, function]} */
  const [userCartsLoading, setUserCartsLoading] = useState(false)
  /** @type {[string | null, function]} */
  const [userCartsError, setUserCartsError] = useState(null)

  // Load users data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchData(`users/${id}`)
        setUser(data)
      } catch (err) {
        setUserError(err.message)
      } finally {
        setUserLoading(false)
      }
    }

    loadUser()
  }, [id])

  useEffect(() => {
    const loadUserCarts = async () => {
      try {
        setUserCartsLoading(true)
        setUserCartsError(null)
        const data = await fetchData(`carts/user/${id}`)
        setUserCarts(data.carts)
      } catch (err) {
        setUserCartsError(err.message)
      } finally {
        setUserCartsLoading(false)
      }
    }
    loadUserCarts()
  }, [id])

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
            <h2 className="carts-title">
              🛒 Shopping Carts ({userCarts.length})
            </h2>

            {userCarts.length > 0 && (
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

          {userCartsLoading ? (
            <LoadingSpinner message="Loading user carts..." />
          ) : userCartsError ? (
            <ErrorState
              error={userCartsError}
              title="Failed to load user carts"
            />
          ) : userCarts.length === 0 ? (
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
              {userCarts.map((cart) =>
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
