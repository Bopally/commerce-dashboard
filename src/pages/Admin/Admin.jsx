import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchData, updateProduct } from '../../services/api.service'
import './Admin.css'

const Admin = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', price: '' })

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
      const data = await fetchData('products')
      let fetchedProducts = data.products || []
      
      // Apply local modifications from localStorage
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

  const handleEdit = (product) => {
    setEditingProduct(product.id)
    setEditForm({ title: product.title, price: product.price.toString() })
  }

  const handleSave = async (productId) => {
    try {
      const updatedData = {
        title: editForm.title,
        price: parseFloat(editForm.price)
      }
      
      // Still call the API (even though it's fake)
      const response = await updateProduct(productId, updatedData)
      
      // Store the modification in localStorage for persistence
      const localModifications = JSON.parse(localStorage.getItem('productModifications') || '{}')
      localModifications[productId] = updatedData
      localStorage.setItem('productModifications', JSON.stringify(localModifications))
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, ...updatedData }
          : product
      ))
      
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

  useEffect(() => {
    fetchProducts()
  }, [])

  const token = localStorage.getItem('authToken')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const userName = userInfo.username || userInfo.firstName || 'Admin'
  
  // Debug: log what we have in storage
  console.log('User info from storage:', userInfo)

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
            <li>📋 <strong>View all products</strong> - See a complete list of all products in the system</li>
            <li>✏️ <strong>Edit product details</strong> - Click "Edit" on any product to modify its name and price</li>
            <li>💾 <strong>Save changes</strong> - Updates are sent to the server and reflected immediately</li>
            <li>🏠 <strong>Navigate back</strong> - Use the "Homepage" button to return to the main site</li>
          </ul>
        </div>

        <div className="admin-info-card">
          <h3>System Information</h3>
          <p><strong>Authentication:</strong> JWT Token Active</p>
          <p><strong>Access Level:</strong> Administrator</p>
        </div>

        <div className="products-management">
          <h2>Product Management</h2>
          
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
                <span>ID</span>
                <span>Product Name</span>
                <span>Price</span>
                <span>Actions</span>
              </div>
              
              {products.map((product) => (
                <div key={product.id} className="table-row">
                  <span>{product.id}</span>
                  
                  {editingProduct === product.id ? (
                    <>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="edit-input"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="edit-input price-input"
                      />
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleSave(product.id)}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="cancel-btn"
                        >
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
    </div>
  )
}

export default Admin