import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../../assets/hooks/useProduct'
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
} from '../../components/LoadingStates'
import { useFavorites } from '../../contexts/FavoritesContext'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { isFavorite, toggleFavorite } = useFavorites()

  // Loading state
  if (loading) {
    return (
      <div className="product-details">
        <Link to="/" className="back-btn">
          ← Back to Products
        </Link>
        <LoadingSpinner message="Loading product details..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="product-details">
        <Link to="/" className="back-btn">
          ← Back to Products
        </Link>
        <ErrorState error={error} title="Failed to load product" />
      </div>
    )
  }

  // Product not found state
  if (!product) {
    return (
      <div className="product-details">
        <Link to="/" className="back-btn">
          ← Back to Products
        </Link>
        <EmptyState
          icon="🔍"
          title="Product not found"
          message="The product you're looking for doesn't exist or has been removed."
        />
      </div>
    )
  }

  return (
    <div className="product-details">
      <Link to="/" className="back-btn">
        ← Back to Products
      </Link>

      <div className="product-details__container">
        <div className="product-details__image">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        <div className="product-details__info">
          <div className="product-header">
            <h1>{product.title}</h1>
            <button
              className={`favorite-btn-large ${
                isFavorite(product.id) ? 'favorite-active' : ''
              }`}
              onClick={() => toggleFavorite(product)}
              aria-label={
                isFavorite(product.id)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              {isFavorite(product.id) ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="brand">{product.brand}</p>
          <p className="price">${product.price}</p>
          <div className="rating">⭐ {product.rating}</div>

          <div className="stock-info">
            <span
              className={`stock ${
                product.stock > 0 ? 'in-stock' : 'out-of-stock'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="description">{product.description}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
