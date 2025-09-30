import { useState, useEffect } from 'react'
import { api } from '../../../services/api.service'

const useProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newProductCounter, setNewProductCounter] = useState(1)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.request(api.endpoints.PRODUCTS.LIST)
      let fetchedProducts = data.products || []

      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )

      const localProducts = Object.values(localModifications).filter(
        (product) =>
          product.id >= 1000 &&
          !fetchedProducts.find((p) => p.id === product.id)
      )

      fetchedProducts = fetchedProducts.map((product) => {
        if (localModifications[product.id]) {
          return { ...product, ...localModifications[product.id] }
        }
        return product
      })

      fetchedProducts = [...fetchedProducts, ...localProducts]

      const maxLocalId = Math.max(0, ...localProducts.map((p) => p.id))
      if (maxLocalId >= 1000) {
        setNewProductCounter(maxLocalId - 1000 + 2)
      }

      setProducts(fetchedProducts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (productId, updatedData) => {
    try {
      await api.request(api.endpoints.PRODUCTS.UPDATE(productId), {
        method: 'PUT',
        body: updatedData
      })

      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )
      localModifications[productId] = updatedData
      localStorage.setItem(
        'productModifications',
        JSON.stringify(localModifications)
      )

      window.dispatchEvent(new CustomEvent('productsUpdated'))

      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, ...updatedData } : product
        )
      )
    } catch (err) {
      console.error('Failed to update product:', err)
    }
  }

  const createProduct = async (productData) => {
    try {
      await api.request(api.endpoints.PRODUCTS.ADD, {
        method: 'POST',
        body: productData
      })

      const shortId = 1000 + newProductCounter
      const newProduct = {
        ...productData,
        id: shortId,
        rating: 4.0,
        stock: productData.stock,
        discountPercentage: 0,
      }

      setProducts([...products, newProduct])
      setNewProductCounter((prev) => prev + 1)

      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )
      localModifications[newProduct.id] = newProduct
      localStorage.setItem(
        'productModifications',
        JSON.stringify(localModifications)
      )

      window.dispatchEvent(new CustomEvent('productsUpdated'))
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      console.log('Attempting to delete product with ID:', productId)

      // Check if this is a locally created product (ID >= 1000)
      const isLocalProduct = productId >= 1000

      if (!isLocalProduct) {
        // Only call API for products that exist on the server
        const result = await api.request(api.endpoints.PRODUCTS.DELETE(productId), {
          method: 'DELETE'
        })
        console.log('Delete API result:', result)
      } else {
        console.log('Deleting local product, skipping API call')
      }

      // Remove from local state regardless of API call result
      setProducts(products.filter(product => product.id !== productId))

      // Remove from localStorage
      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )
      delete localModifications[productId]
      localStorage.setItem(
        'productModifications',
        JSON.stringify(localModifications)
      )

      window.dispatchEvent(new CustomEvent('productsUpdated'))
      console.log('Product deleted successfully')
    } catch (error) {
      console.error('Failed to delete product:', error)
      console.error('Error details:', error.message, error.stack)
      throw error
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    updateProduct,
    createProduct,
    deleteProduct,
  }
}

export default useProductManagement