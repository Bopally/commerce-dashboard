import React, { useEffect, useState } from 'react'
import './ProductList.css'
import ProductCard from './ProductCard'
import { fetchData } from '../../services/api.service'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
  ProductsLoadingSkeleton,
} from '../../components/LoadingStates'
import Quote from '../../components/quotes'
import clsx from 'clsx'

export const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchData('products')
      setProducts(data.products || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Loading state with skeleton
  if (loading) {
    return (
      <div className={clsx("products-container", "loading-state")}>
        <h1>✨ Our products ✨</h1>
        <ProductsLoadingSkeleton />
      </div>
    )
  }

  // Error state with retry functionality
  if (error) {
    return (
      <>
        <h1>✨ Our products ✨</h1>
        <ErrorState
          error={error}
          onRetry={fetchProducts}
          title="Failed to load products"
        />
      </>
    )
  }

  // Empty state (no products found)
  if (products.length === 0) {
    return (
      <>
        <h1>✨ Our products ✨</h1>
        <EmptyState
          icon="🏪"
          title="No products available"
          message="We're working on adding more products. Check back soon!"
        />
      </>
    )
  }

  // Success state - render products
  return (
    <>
      <h1>✨ Our products ✨</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Quote />
    </>
  )
}
