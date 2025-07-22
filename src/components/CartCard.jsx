import './CartCard.css'

function CartCard({ cart }) {
  const totalProducts = cart.products?.length || 0
  const totalQuantity =
    cart.products?.reduce((sum, product) => sum + product.quantity, 0) || 0

  return (
    <div className="cart-card">
      <div className="cart-header">
        <h3 className="cart-title">🛒 Cart #{cart.id}</h3>
        <div className="cart-meta">
          <span className="cart-total">
            ${cart.total?.toFixed(2) || '0.00'}
          </span>
          <span className="cart-discount">
            -${cart.discountedTotal?.toFixed(2) || '0.00'} saved
          </span>
        </div>
      </div>

      <div className="cart-stats">
        <div className="stat-item">
          <span className="stat-label">📦 Products:</span>
          <span className="stat-value">{totalProducts}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">🔢 Total Items:</span>
          <span className="stat-value">{totalQuantity}</span>
        </div>
      </div>

      {cart.products && cart.products.length > 0 && (
        <div className="cart-products">
          <h4 className="products-title">Products in cart:</h4>
          <div className="products-list">
            {cart.products.slice(0, 3).map((product) => (
              <div key={product.id} className="cart-product">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="product-thumb"
                />
                <div className="product-info">
                  <span className="product-name">{product.title}</span>
                  <span className="product-details">
                    ${product.price} × {product.quantity}
                  </span>
                </div>
              </div>
            ))}
            {cart.products.length > 3 && (
              <div className="more-products">
                +{cart.products.length - 3} more products
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartCard
