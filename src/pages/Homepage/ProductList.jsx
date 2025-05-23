import React, { useEffect, useState } from "react";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then(res => {
        if (!res.ok) throw new Error("Error loading");
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <h1>Our products</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="products-grid">
          {products.map(product => (
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
          ))}
        </div>
      )}
    </main>
  );
}

export default ProductList;