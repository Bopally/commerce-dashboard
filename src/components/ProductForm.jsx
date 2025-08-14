import React, { useState } from 'react'
import './ProductForm.css'

const ProductForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    stock: initialData?.stock || '',
    thumbnail: initialData?.thumbnail || ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const validateField = (name, value) => {
    const fieldErrors = {}

    switch (name) {
      case 'title':
        if (!value.trim()) {
          fieldErrors.title = 'Product title is required'
        } else if (value.trim().length < 3) {
          fieldErrors.title = 'Title must be at least 3 characters long'
        } else if (value.trim().length > 100) {
          fieldErrors.title = 'Title must not exceed 100 characters'
        }
        break

      case 'description':
        if (!value.trim()) {
          fieldErrors.description = 'Description is required'
        } else if (value.trim().length < 10) {
          fieldErrors.description = 'Description must be at least 10 characters long'
        } else if (value.trim().length > 500) {
          fieldErrors.description = 'Description must not exceed 500 characters'
        }
        break

      case 'price':
        if (!value) {
          fieldErrors.price = 'Price is required'
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          fieldErrors.price = 'Price must be a positive number'
        } else if (parseFloat(value) > 999999) {
          fieldErrors.price = 'Price must not exceed 999,999'
        }
        break

      case 'category':
        if (!value.trim()) {
          fieldErrors.category = 'Category is required'
        }
        break

      case 'brand':
        if (!value.trim()) {
          fieldErrors.brand = 'Brand is required'
        } else if (value.trim().length > 50) {
          fieldErrors.brand = 'Brand name must not exceed 50 characters'
        }
        break

      case 'stock':
        if (!value) {
          fieldErrors.stock = 'Stock quantity is required'
        } else if (isNaN(value) || parseInt(value) < 0) {
          fieldErrors.stock = 'Stock must be a non-negative number'
        } else if (parseInt(value) > 99999) {
          fieldErrors.stock = 'Stock must not exceed 99,999'
        }
        break

      case 'thumbnail':
        if (value && !isValidURL(value)) {
          fieldErrors.thumbnail = 'Please enter a valid URL'
        }
        break

      default:
        break
    }

    return fieldErrors
  }

  const isValidURL = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const validateForm = () => {
    let allErrors = {}
    
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field])
      allErrors = { ...allErrors, ...fieldErrors }
    })

    return allErrors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Reset image states when thumbnail URL changes
    if (name === 'thumbnail') {
      setImageError(false)
      setImageLoading(false)
    }

    // Real-time validation
    const fieldErrors = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }
      
      await onSubmit(productData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries',
    'home-decoration', 'furniture', 'tops', 'womens-dresses', 'womens-shoes',
    'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches',
    'womens-bags', 'womens-jewellery', 'sunglasses', 'automotive',
    'motorcycle', 'lighting'
  ]

  return (
    <div className="product-form-overlay">
      <div className="product-form-container">
        <div className="product-form-header">
          <h2>{initialData?.id ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-button" onClick={onCancel} type="button">
            ✖️
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter product title"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={errors.brand ? 'error' : ''}
                placeholder="Enter brand name"
              />
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? 'error' : ''}
              placeholder="Enter product description"
              rows={4}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={errors.price ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={errors.stock ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail">Product Image URL</label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleInputChange}
              className={errors.thumbnail ? 'error' : ''}
              placeholder="https://example.com/image.jpg"
            />
            {errors.thumbnail && <span className="error-message">{errors.thumbnail}</span>}
          </div>

          {formData.thumbnail && isValidURL(formData.thumbnail) && (
            <div className="image-preview">
              <label>Preview:</label>
              {imageLoading && <div className="image-loading">Loading image...</div>}
              {imageError && <div className="image-error">Failed to load image</div>}
              <img 
                src={formData.thumbnail} 
                alt="Product preview" 
                onError={() => {
                  setImageError(true)
                  setImageLoading(false)
                }}
                onLoad={() => {
                  setImageError(false)
                  setImageLoading(false)
                }}
                onLoadStart={() => {
                  setImageLoading(true)
                  setImageError(false)
                }}
                style={{ 
                  display: imageError ? 'none' : 'block',
                  opacity: imageLoading ? 0.5 : 1
                }}
              />
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm