import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../../assets/hooks/useProduct'
import Spinner from '../../components/spinner'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)

  if (loading) return <Spinner />
  if (error) return <div className="error">Error: {error}</div>
  if (!product) return <div className="error">Product not found</div>

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
          <h1>{product.title}</h1>
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
