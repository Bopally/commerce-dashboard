import React, { useEffect, useState, useRef } from 'react'
import './ProductList.css'
import ProductCard from './ProductCard'
import { api } from '../../services/api.service'
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
      // Using the new centralized API
      const data = await api.request(api.endpoints.PRODUCTS.LIST)
      let fetchedProducts = data.products || []

      // Apply local modifications from localStorage (from admin edits)
      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )

      // Add any locally created products that aren't in the API response
      const localProducts = Object.values(localModifications).filter(
        (product) =>
          product.id >= 1000 &&
          !fetchedProducts.find((p) => p.id === product.id)
      )

      // Apply modifications to existing products
      fetchedProducts = fetchedProducts.map((product) => {
        if (localModifications[product.id]) {
          return { ...product, ...localModifications[product.id] }
        }
        return product
      })

      // Add local products to the end of the list
      fetchedProducts = [...fetchedProducts, ...localProducts]

      setProducts(fetchedProducts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()

    // Listen for storage changes (when admin adds products)
    const handleStorageChange = (e) => {
      if (e.key === 'productModifications') {
        // Reset the ref to allow re-fetching
        productsLoadedRef.current = false
        fetchProducts()
      }
    }

    // Listen for visibility changes (when returning from admin panel)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Reset the ref to allow re-fetching when page becomes visible
        productsLoadedRef.current = false
        fetchProducts()
      }
    }

    // Listen for custom products updated event from admin panel
    const handleProductsUpdated = () => {
      productsLoadedRef.current = false
      fetchProducts()
    }

    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('productsUpdated', handleProductsUpdated)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('productsUpdated', handleProductsUpdated)
    }
  }, [])

  // Loading state with skeleton
  if (loading) {
    return (
      <div className={clsx('products-container', 'loading-state')}>
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
