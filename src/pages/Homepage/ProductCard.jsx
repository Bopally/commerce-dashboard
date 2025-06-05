import "./ProductCard.css";

function ProductCard({ product }) {
  return (
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
            <p className="product-price"><strong>{product.price} €</strong></p>
            <p className="product-rating">Rating: {product.rating} / 5</p>
            <p className="product-category">{product.category}</p>
    </div>
  );
}

export default ProductCard;