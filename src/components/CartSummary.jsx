import './CartSummary.css'

/**
 * @typedef {import('../types/interfaces.js').Cart} Cart
 */

/**
 * CartSummary component displays a summarized view of a shopping cart
 * @param {Object} props
 * @param {Cart} props.cart - Cart data to display
 * @returns {JSX.Element | null}
 */
function CartSummary({ cart }) {
  if (!cart) {
    return null
  }

  /** @type {number} */
  const totalProducts = cart.products?.length || 0
  /** @type {number} */
  const totalQuantity =
    cart.products?.reduce((sum, product) => sum + product.quantity, 0) || 0
  /** @type {number} */
  const totalValue = cart.total || 0
  /** @type {number} */
  const discountedTotal = cart.discountedTotal || 0
  /** @type {number} */
  const savings = totalValue - discountedTotal

  return (
    <div className="cart-summary">
      <div className="cart-summary__header">
        <h3 className="cart-summary__title">🛒 Cart Summary</h3>
        <span className="cart-summary__id">#{cart.id}</span>
      </div>

      <div className="cart-summary__stats">
        <div className="summary-stat">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-label">Products</span>
            <span className="stat-value">{totalProducts}</span>
          </div>
        </div>

        <div className="summary-stat">
          <div className="stat-icon">🔢</div>
          <div className="stat-content">
            <span className="stat-label">Total Items</span>
            <span className="stat-value">{totalQuantity}</span>
          </div>
        </div>

        <div className="summary-stat">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Subtotal</span>
            <span className="stat-value">${totalValue.toFixed(2)}</span>
          </div>
        </div>

        {savings > 0 && (
          <div className="summary-stat savings">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <span className="stat-label">Savings</span>
              <span className="stat-value">-${savings.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="cart-summary__total">
        <span className="total-label">Final Total:</span>
        <span className="total-amount">${discountedTotal.toFixed(2)}</span>
      </div>

      {cart.products && cart.products.length > 0 && (
        <div className="cart-summary__products">
          <h4 className="products-header">Items in Cart:</h4>
          <div className="products-list">
            {cart.products.map((product) => (
              <div key={product.id} className="summary-product">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="summary-product__image"
                />
                <div className="summary-product__info">
                  <span className="product-title">{product.title}</span>
                  <div className="product-pricing">
                    <span className="product-quantity">
                      Qty: {product.quantity}
                    </span>
                    <span className="product-price">${product.price}</span>
                    <span className="product-total">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartSummary
