import React from 'react'
import ProductCard from './ProductCard'
import { useFavorites } from '../../contexts/FavoritesContext'
import { FavoritesEmptyState } from '../../components/LoadingStates'
import { useNavigate } from 'react-router-dom'

function FavoritesList() {
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  const handleBrowseProducts = () => {
    navigate('/')
  }

  // Empty favorites state
  if (favorites.length === 0) {
    return (
      <>
        <h1>My Favorites 💗 (0)</h1>
        <FavoritesEmptyState onBrowseProducts={handleBrowseProducts} />
      </>
    )
  }

  // Success state - render favorites
  return (
    <div className="favorites-container">
      <h1>My Favorites 💗 ({favorites.length})</h1>
      <div className="favorites-stats">
        <p className="favorites-count">
          {favorites.length === 1
            ? 'You have 1 favorite product'
            : `You have ${favorites.length} favorite products`}
        </p>
      </div>
      <div className="products-grid">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default FavoritesList
