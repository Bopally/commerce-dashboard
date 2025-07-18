import './ProductCard.css'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'

function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleFavoriteClick = (e) => {
    e.preventDefault() // Empêche la navigation vers la page produit
    e.stopPropagation()
    toggleFavorite(product)
  }

  return (
    <Link to={`products/${product.id}`} className="product-card-link">
      <div className="product-card" key={product.id}>
        <div className="image-hover-container">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-image"
          />
          <div className="description-hover">
            <p>{product.description}</p>
          </div>
        </div>
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">
          <strong>{product.price} €</strong>
        </p>
        <p className="product-category">{product.category}</p>
        <button
          className={`favorite-btn ${
            isFavorite(product.id) ? 'favorite-active' : ''
          }`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite(product.id)
              ? 'Remove from favorites'
              : 'Add to favorites'
          }
        >
          {isFavorite(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
    </Link>
  )
}

export default ProductCard
