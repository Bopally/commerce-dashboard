import React, { useEffect, useState, useRef } from 'react'
import './ProductList.css'
import ProductCard from './ProductCard'
import { fetchData } from '../../services/api.service'
import {
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
  const productsLoadedRef = useRef(false)

  const fetchProducts = async () => {
    if (productsLoadedRef.current) return
    productsLoadedRef.current = true

    try {
      setLoading(true)
      setError('')
      const data = await fetchData('products')
      let fetchedProducts = data.products || []
      
      // Apply local modifications from localStorage (from admin edits)
      const localModifications = JSON.parse(localStorage.getItem('productModifications') || '{}')
      fetchedProducts = fetchedProducts.map(product => {
        if (localModifications[product.id]) {
          return { ...product, ...localModifications[product.id] }
        }
        return product
      })
      
      setProducts(fetchedProducts)
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
