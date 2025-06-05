import React, { useEffect, useState } from "react";
import "./ProductList.css";
import ProductCard from "./ProductCard";
import Spinner from "../../components/spinner";
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
      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="products-grid"> 
          {products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
        </div>
      )}
    </main>
  );
}

export default ProductList;