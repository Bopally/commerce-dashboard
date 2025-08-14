import React from 'react'
import { useUserCarts } from '../../assets/hooks/useUserCarts'
import CartCard from '../../components/CartCard'
import CartSummary from '../../components/CartSummary'
import { ErrorState, EmptyState, ProductsLoadingSkeleton } from '../../components/LoadingStates'
import './MyCarts.css'

const MyCarts = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const userId = userInfo.id
  const userName = userInfo.firstName || userInfo.username || 'User'
  
  const { carts, loading, error } = useUserCarts(userId)

  // Loading state
  if (loading) {
    return (
      <div className="my-carts-container">
        <h1>🛒 My Carts</h1>
        <ProductsLoadingSkeleton />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="my-carts-container">
        <h1>🛒 My Carts</h1>
        <ErrorState
          error={error}
          title="Failed to load carts"
        />
      </div>
    )
  }

  // Empty state
  if (!carts || carts.length === 0) {
    return (
      <div className="my-carts-container">
        <h1>🛒 My Carts</h1>
        <EmptyState
          icon="🛒"
          title="No carts found"
          message={`${userName}, you don't have any carts yet. Start shopping to create your first cart!`}
        />
      </div>
    )
  }

  // Success state - render carts
  return (
    <div className="my-carts-container">
      <h1>🛒 My Carts - {userName}</h1>
      <div className="carts-grid">
        {carts.map((cart) => (
          <div key={cart.id} className="cart-item">
            <CartCard cart={cart} />
            <CartSummary cart={cart} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyCarts