import './UserCard.css'
import { Link } from 'react-router-dom'
import { fetchData } from '../../services/api.service'
import { useState, useEffect } from 'react'

/**
 * @typedef {import('../../types/interfaces.js').User} User
 * @typedef {import('../../types/interfaces.js').UserHandlers} UserHandlers
 */

/**
 * UserCard component displays a summary card for a single user
 * @param {Object} props
 * @param {User} props.user - User data to display
 * @param {UserHandlers} props.handlers - Handler functions from parent component
 * @returns {JSX.Element}
 */
function UserCard({ user }) {
  const [userCarts, setUserCarts] = useState([])
  const [userCartsLoading, setUserCartsLoading] = useState(true)

  useEffect(() => {
    const loadUserCarts = async () => {
      try {
        const data = await fetchData(`carts/user/${user.id}`)
        setUserCarts(data.carts)
      } catch (err) {
        console.error('Failed to load user carts:', err.message)
      } finally {
        setUserCartsLoading(false)
      }
    }
    loadUserCarts()
  }, [user.id])

  return (
    <Link
      to={`/commerce-dashboard/users/${user.id}`}
      className="user-card-link"
    >
      <div className="user-card">
        <div className="user-card__header">
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="user-avatar"
          />
          <div className="user-basic-info">
            <h3 className="user-name">
              {user.firstName} {user.lastName}
            </h3>
            <p className="user-email">{user.email}</p>

            <p className="user-cart-count">
              🛒{' '}
              {userCartsLoading
                ? 'Loading...'
                : `${userCarts.length} ${
                    userCarts.length === 1 ? 'cart' : 'carts'
                  }`}
            </p>
          </div>
        </div>

        <div className="user-card__details">
          <div className="user-detail-row">
            <span className="detail-label">📱 Phone:</span>
            <span className="detail-value">{user.phone}</span>
          </div>

          <div className="user-detail-row">
            <span className="detail-label">🎂 Age:</span>
            <span className="detail-value">{user.age} years old</span>
          </div>

          <div className="user-detail-row">
            <span className="detail-label">👤 Gender:</span>
            <span className="detail-value">{user.gender}</span>
          </div>

          {user.address && (
            <div className="user-detail-row">
              <span className="detail-label">📍 Location:</span>
              <span className="detail-value">
                {user.address.city}, {user.address.state}
              </span>
            </div>
          )}

          {user.company && (
            <div className="user-detail-row">
              <span className="detail-label">💼 Job:</span>
              <span className="detail-value">
                {user.company.title} at {user.company.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default UserCard
