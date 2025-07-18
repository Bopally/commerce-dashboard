import ProductList from './ProductList'
import Quote from '../../components/quotes'
import FavoritesList from './FavoritesList'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ProductDetails from './ProductDetails'
import { useFavorites } from '../../contexts/FavoritesContext'

function Homepage() {
  const { favorites } = useFavorites()

  return (
    <Router basename="/commerce-dashboard">
      <div>
        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">
            🏠 Homepage
          </Link>
          <Link to="/favorites" className="nav-link">
            💗 Favorites ({favorites.length})
          </Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProductList />
                <Quote />
              </>
            }
          />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/favorites" element={<FavoritesList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default Homepage
