import React from 'react'
import Spinner from './spinner'
import './LoadingStates.css'

// Generic loading spinner component
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-state">
    <Spinner />
    <p className="loading-message">{message}</p>
  </div>
)

// Error state component
export const ErrorState = ({
  error,
  onRetry,
  title = 'Something went wrong',
}) => (
  <div className="error-state">
    <div className="error-icon">⚠️</div>
    <h3 className="error-title">{title}</h3>
    <p className="error-message">{error}</p>
    {onRetry && (
      <button className="retry-button" onClick={onRetry}>
        🔄 Try Again
      </button>
    )}
  </div>
)

// Empty state component for when no data is found
export const EmptyState = ({
  icon = '📦',
  title = 'No items found',
  message = 'There are no items to display.',
  action,
}) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3 className="empty-title">{title}</h3>
    <p className="empty-message">{message}</p>
    {action && action}
  </div>
)

// Favorites empty state
export const FavoritesEmptyState = ({ onBrowseProducts }) => (
  <EmptyState
    icon="💝"
    title="No favorites yet"
    message="Start building your collection by adding products to your favorites!"
    action={
      onBrowseProducts && (
        <button className="browse-button" onClick={onBrowseProducts}>
          🛍️ Browse Products
        </button>
      )
    }
  />
)

// Products loading skeleton
export const ProductsLoadingSkeleton = () => (
  <div className="products-grid">
    {Array.from({ length: 6 }, (_, index) => (
      <div key={index} className="product-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-category"></div>
      </div>
    ))}
  </div>
)

// Network status indicator
export const NetworkStatus = ({ isOnline }) => {
  if (isOnline === false) {
    return (
      <div className="network-status offline">
        📡 You're offline. Some features may not work properly.
      </div>
    )
  }
  return null
}
