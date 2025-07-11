import ProductList from './ProductList'
import Quote from '../../components/quotes'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetails from './ProductDetails'

function Homepage() {
  return (
    <Router basename="/commerce-dashboard">
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
      </Routes>
    </Router>
  )
}

export default Homepage
