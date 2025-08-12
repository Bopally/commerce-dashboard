import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './pages/Homepage/Header.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import ProductDetails from './pages/Homepage/ProductDetails.jsx'
import { FavoriteProductDetails } from './pages/Homepage/FavoriteProductDetails.jsx'
import FavoritesList from './pages/Homepage/FavoritesList.jsx'
import { ProductList } from './pages/Homepage/ProductList.jsx'
import { UsersList } from './pages/Homepage/UsersList.jsx'
import UserProfile from './pages/Homepage/UserProfile.jsx'
import Login from './pages/Auth/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          <Route
            path="/"
            element={<Navigate replace to="/commerce-dashboard" />}
          />
          <Route path="auth/login" element={<Login />} />
          <Route path="commerce-dashboard" element={<Header />}>
            <Route index element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserProfile />} />
            <Route path="favorites" element={<FavoritesList />} />
            <Route
              path="favorites/products/:id"
              element={<FavoriteProductDetails />}
            />
          </Route>
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
)
