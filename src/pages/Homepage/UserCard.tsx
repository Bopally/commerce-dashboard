import './UserCard.css'
import { Link } from 'react-router-dom'
import { fetchData } from '../../services/api.service.ts'
import { useState, useEffect } from 'react'
import type { Cart } from '../../types/cart.d.ts'

interface User {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  ip: string
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    coordinates: {
      lat: number
      lng: number
    }
    country: string
  }
  macAddress: string
  university: string
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  company: {
    department: string
    name: string
    title: string
    address: {
      address: string
      city: string
      state: string
      stateCode: string
      postalCode: string
      coordinates: {
        lat: number
        lng: number
      }
      country: string
    }
  }
  ein: string
  ssn: string
  userAgent: string
  crypto: {
    coin: string
    wallet: string
    network: string
  }
  role: string
}

interface UserCardProps {
  user: User
}

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
function UserCard({ user }: UserCardProps) {
  const [userCarts, setUserCarts] = useState<Cart[]>([])
  const [userCartsLoading, setUserCartsLoading] = useState(true)

  useEffect(() => {
    const loadUserCarts = async () => {
      try {
        const data = await fetchData(`carts/user/${user.id}`)
        setUserCarts(data.carts as Cart[])
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
