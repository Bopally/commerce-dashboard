import React, { useState, useEffect } from 'react'
import { api } from '../../services/api.service'
import UserCard from './UserCard'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
  ProductsLoadingSkeleton,
} from '../../components/LoadingStates'
import clsx from 'clsx'

/**
 * @typedef {import('../../types/interfaces.js').User} User
 */

/**
 * UsersList component displays a grid of user cards
 * @returns {JSX.Element}
 */

export const UsersList = () => {
  /** @type {[User[], function]} */
  const [users, setUsers] = useState([])
  /** @type {[boolean, function]} */
  const [usersLoading, setUsersLoading] = useState(false)
  /** @type {[string | null, function]} */
  const [usersError, setUsersError] = useState(null)
  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      // if (usersLoadedRef.current) return
      // usersLoadedRef.current = true

      try {
        setUsersLoading(true)
        setUsersError(null)
        // Using the new centralized API
        const data = await api.request(api.endpoints.USERS.LIST)
        setUsers(data.users || [])
      } catch (err) {
        setUsersError(err.message)
      } finally {
        setUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Load all carts when component mounts for better performance
  // useEffect(() => {
  //   if (loadAllCarts) {
  //     loadAllCarts()
  //   }
  // }, [loadAllCarts])

  // Loading state with skeleton
  if (usersLoading) {
    return (
      <div className={clsx('users-container', 'loading-state')}>
        <h1>👥 Our Users 👥</h1>
        <ProductsLoadingSkeleton />
      </div>
    )
  }

  // Error state with retry functionality
  if (usersError) {
    return (
      <div className={clsx('users-container')}>
        <h1>👥 Our Users 👥</h1>
        <ErrorState error={usersError} title="Failed to load users" />
      </div>
    )
  }

  // Empty state (no users found)
  if (users.length === 0) {
    return (
      <div className={clsx('users-container')}>
        <h1>👥 Our Users 👥</h1>
        <EmptyState
          icon="👤"
          title="No users available"
          message="We couldn't find any users. Please try again later."
        />
      </div>
    )
  }

  // Success state - render users
  return (
    <div className={clsx('users-container')}>
      <h1>👥 Our Users ({users.length}) 👥</h1>
      <div className={clsx('users-grid')}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
