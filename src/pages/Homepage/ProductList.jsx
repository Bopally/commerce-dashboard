import React, { useEffect, useState } from 'react'
import './ProductList.css'
import ProductCard from './ProductCard'
import Spinner from '../../components/spinner'
import { fetchData } from '../../services/api.service'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchData('products')
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <Spinner />
  }
  if (error) {
    return <p className="error">{error}</p>
  }
  return (
    <>
      <h1>✨ Our products ✨</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}

export default ProductList
