import { useState } from 'react'
import ProductForm from '../../components/ProductForm'
import AdminHeader from './components/AdminHeader'
import AdminWelcomeSection from './components/AdminWelcomeSection'
import ProductTable from './components/ProductTable'
import useProductManagement from './hooks/useProductManagement'
import './Admin.css'

// TODO:
// - add a "delete" button to delete a product in the admin page
// - find online how to use toastify to show error messages
// - prevent non admin users from accessing this page

const Admin = () => {
  const [showProductForm, setShowProductForm] = useState(false)
  const [formProduct, setFormProduct] = useState(null)

  const {
    products,
    loading,
    error,
    fetchProducts,
    updateProduct,
    createProduct,
    deleteProduct,
  } = useProductManagement()

  const handleAddProduct = () => {
    setFormProduct(null)
    setShowProductForm(true)
  }

  const handleFormSubmit = async (productData) => {
    if (formProduct) {
      await updateProduct(formProduct.id, productData)
    } else {
      await createProduct(productData)
    }
    setShowProductForm(false)
    setFormProduct(null)
  }

  const handleFormCancel = () => {
    setShowProductForm(false)
    setFormProduct(null)
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const userName = userInfo.username || userInfo.firstName || 'Admin'

  return (
    <div className="admin-container">
      <AdminHeader userName={userName} />

      <div className="admin-content">
        <AdminWelcomeSection userName={userName} />

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
            <ProductTable
              products={products}
              onProductUpdate={updateProduct}
              onProductDelete={deleteProduct}
            />
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
