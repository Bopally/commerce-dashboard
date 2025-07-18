import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './pages/Homepage/Homepage.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import ProductDetails from './pages/Homepage/ProductDetails.jsx'
import FavoritesList from './pages/Homepage/FavoritesList.jsx'
import ProductList from './pages/Homepage/ProductList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          <Route
            path="/"
            element={<Navigate replace to="/commerce-dashboard" />}
          />
          <Route path="commerce-dashboard" element={<Homepage />}>
            <Route index element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="favorites" element={<FavoritesList />} />
          </Route>
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
)
