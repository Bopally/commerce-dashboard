import React from 'react'
import UserCard from './UserCard'
import { useUsers } from '../../assets/hooks/useUsers'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
  ProductsLoadingSkeleton,
} from '../../components/LoadingStates'

export const UsersList = () => {
  const { users, loading, error } = useUsers()

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="users-container">
        <h1>👥 Our Users 👥</h1>
        <ProductsLoadingSkeleton />
      </div>
    )
  }

  // Error state with retry functionality
  if (error) {
    return (
      <div className="users-container">
        <h1>👥 Our Users 👥</h1>
        <ErrorState error={error} title="Failed to load users" />
      </div>
    )
  }

  // Empty state (no users found)
  if (users.length === 0) {
    return (
      <div className="users-container">
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
    <div className="users-container">
      <h1>👥 Our Users ({users.length}) 👥</h1>
      <div className="users-grid">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
