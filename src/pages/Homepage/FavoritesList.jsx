import ProductCard from './ProductCard'
import { useFavorites } from '../../contexts/FavoritesContext'

function FavoritesList() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No favorites yet</h2>
        <p>Add products to your favorites by clicking on the heart!</p>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <h1>My Favorites 💗 ({favorites.length})</h1>
      <div className="products-grid">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default FavoritesList
