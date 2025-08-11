import React, { useEffect } from 'react'
import UserCard from './UserCard'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
  ProductsLoadingSkeleton,
} from '../../components/LoadingStates'
import clsx from 'clsx'

export const UsersList = ({ handlers }) => {
  // Get data from lifted state via props instead of hooks
  const { users, usersLoading: loading, usersError: error, loadAllCarts } = handlers || {}

  // Load all carts when component mounts for better performance
  useEffect(() => {
    if (loadAllCarts) {
      loadAllCarts()
    }
  }, [loadAllCarts])

  // Loading state with skeleton
  if (loading) {
    return (
      <div className={clsx("users-container", "loading-state")}>
        <h1>👥 Our Users 👥</h1>
        <ProductsLoadingSkeleton />
      </div>
    )
  }

  // Error state with retry functionality
  if (error) {
    return (
      <div className={clsx("users-container")}>
        <h1>👥 Our Users 👥</h1>
        <ErrorState error={error} title="Failed to load users" />
      </div>
    )
  }

  // Empty state (no users found)
  if (users.length === 0) {
    return (
      <div className={clsx("users-container")}>
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
    <div className={clsx("users-container")}>
      <h1>👥 Our Users ({users.length}) 👥</h1>
      <div className={clsx("users-grid")}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} handlers={handlers} />
        ))}
      </div>
    </div>
  )
}
