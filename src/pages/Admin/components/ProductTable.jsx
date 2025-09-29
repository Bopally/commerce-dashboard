import { useState } from 'react'

const ProductTable = ({ products, onProductUpdate }) => {
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', price: '' })

  const handleEdit = (product) => {
    setEditingProduct(product.id)
    setEditForm({ title: product.title, price: product.price.toString() })
  }

  const handleSave = async (productId) => {
    const updatedData = {
      title: editForm.title,
      price: parseFloat(editForm.price),
    }

    await onProductUpdate(productId, updatedData)
    setEditingProduct(null)
    setEditForm({ title: '', price: '' })
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setEditForm({ title: '', price: '' })
  }

  return (
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
  )
}

export default ProductTable