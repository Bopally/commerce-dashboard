import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { productsApi } from '../../services/api.service'
import ProductForm from '../../components/ProductForm'
import './Admin.css'

// TODO:
// - add a "delete" button to delete a product in the admin page
// - refacto the admin page - make it more readable and maintainable
// - find online how to use toastify to show error messages
// - prevent non admin users from accessing this page

const Admin = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', price: '' })
  const [showProductForm, setShowProductForm] = useState(false)
  const [formProduct, setFormProduct] = useState(null)
  const [newProductCounter, setNewProductCounter] = useState(1)

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    navigate('/auth/login')
  }

  const handleBackToHomepage = () => {
    navigate('/commerce-dashboard')
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      // Using the new centralized API
      const data = await productsApi.getAll()
      let fetchedProducts = data.products || []

      // Apply local modifications from localStorage
      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )

      // Add any locally created products that aren't in the API response
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

      // Add local products to the end
      fetchedProducts = [...fetchedProducts, ...localProducts]

      // Set counter based on highest local ID
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

  const handleEdit = (product) => {
    setEditingProduct(product.id)
    setEditForm({ title: product.title, price: product.price.toString() })
  }

  const handleSave = async (productId) => {
    try {
      const updatedData = {
        title: editForm.title,
        price: parseFloat(editForm.price), // avoid floating point errors
      }

      // Still call the API (even though it's fake)
      await productsApi.update(productId, updatedData)

      // Store the modification in localStorage for persistence
      const localModifications = JSON.parse(
        localStorage.getItem('productModifications') || '{}'
      )
      localModifications[productId] = updatedData
      localStorage.setItem(
        'productModifications',
        JSON.stringify(localModifications)
      )

      // Trigger event to notify other components about product changes
      window.dispatchEvent(new CustomEvent('productsUpdated'))

      // Update local state
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, ...updatedData } : product
        )
      )

      setEditingProduct(null)
      setEditForm({ title: '', price: '' })
    } catch (err) {
      console.error('Failed to update product:', err)
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setEditForm({ title: '', price: '' })
  }

  const handleAddProduct = () => {
    setFormProduct(null)
    setShowProductForm(true)
  }

  const handleFormSubmit = async (productData) => {
    try {
      if (formProduct) {
        // Update existing product (if we add edit via form later)
        await productsApi.update(formProduct.id, productData)
        setProducts(
          products.map((product) =>
            product.id === formProduct.id
              ? { ...product, ...productData }
              : product
          )
        )
      } else {
        // Create new product
        await productsApi.create(productData)

        // Generate a short, simple ID for the new product
        const shortId = 1000 + newProductCounter
        const newProduct = {
          ...productData, // Use form data directly since API response might be inconsistent
          id: shortId,
          rating: 4.0, // Default rating
          stock: productData.stock,
          discountPercentage: 0,
        }

        setProducts([...products, newProduct]) // Add to bottom of list
        setNewProductCounter((prev) => prev + 1) // Increment counter for next product

        // Store in localStorage for persistence
        const localModifications = JSON.parse(
          localStorage.getItem('productModifications') || '{}'
        )
        localModifications[newProduct.id] = newProduct
        localStorage.setItem(
          'productModifications',
          JSON.stringify(localModifications)
        )

        // Trigger event to notify other components about product changes
        window.dispatchEvent(new CustomEvent('productsUpdated'))
      }

      setShowProductForm(false)
      setFormProduct(null)
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleFormCancel = () => {
    setShowProductForm(false)
    setFormProduct(null)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const userName = userInfo.username || userInfo.firstName || 'Admin'

  // log what we have in storage
  // console.log('User info from storage:', userInfo)

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="header-buttons">
          <button className="back-button" onClick={handleBackToHomepage}>
            🏠 Homepage
          </button>
          <button className="logout-button" onClick={handleLogout}>
            🔑 Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="welcome-card">
          <h2>Hey {userName}, welcome to your admin dashboard! 👋</h2>
          <p>Here's what you can do:</p>
          <ul>
            <li>
              📋 <strong>View all products</strong> - See a complete list of all
              products in the system
            </li>
            <li>
              ✏️ <strong>Edit product details</strong> - Click "Edit" on any
              product to modify its name and price
            </li>
            <li>
              💾 <strong>Save changes</strong> - Updates are sent to the server
              and reflected immediately
            </li>
            <li>
              🏠 <strong>Navigate back</strong> - Use the "Homepage" button to
              return to the main site
            </li>
          </ul>
        </div>

        <div className="admin-info-card">
          <h3>System Information</h3>
          <p>
            <strong>Authentication:</strong> JWT Token Active
          </p>
          <p>
            <strong>Access Level:</strong> Administrator
          </p>
        </div>

        <div className="products-management">
          <div className="products-header">
            <h2>Product Management</h2>
            <button className="add-product-btn" onClick={handleAddProduct}>
              ➕ Add New Product
            </button>
          </div>

          {loading && <div className="loading">Loading products...</div>}

          {error && (
            <div className="error">
              Error: {error}
              <button onClick={fetchProducts}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className="products-table">
              <div className="table-header">
                <span>Product Name</span>
                <span>Price</span>
                <span>Actions</span>
              </div>

              {products.map((product) => (
                <div key={product.id} className="table-row">
                  {editingProduct === product.id ? (
                    <>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="edit-input"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        className="edit-input price-input"
                      />
                      <div className="action-buttons">
                        <button
                          onClick={() => handleSave(product.id)}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button onClick={handleCancel} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{product.title}</span>
                      <span>${product.price}</span>
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showProductForm && (
        <ProductForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={formProduct}
        />
      )}
    </div>
  )
}

export default Admin
