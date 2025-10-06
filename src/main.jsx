import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './pages/Homepage/Header.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { Route, Navigate, Routes, BrowserRouter } from 'react-router-dom'
import ProductDetails from './pages/Homepage/ProductDetails.jsx'
import { FavoriteProductDetails } from './pages/Homepage/FavoriteProductDetails.jsx'
import FavoritesList from './pages/Homepage/FavoritesList.jsx'
import { ProductList } from './pages/Homepage/ProductList.jsx'
import { UsersList } from './pages/Homepage/UsersList.jsx'
import UserProfile from './pages/Homepage/UserProfile.jsx'
import MyCarts from './pages/Homepage/MyCarts.jsx'
import Login from './pages/Auth/Login.jsx'
import Admin from './pages/Admin/Admin.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavoritesProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate replace to="/commerce-dashboard" />}
          />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/commerce-dashboard" element={<Header />}>
            <Route index element={<ProductList />} />
            <Route path="admin" element={<Admin />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserProfile />} />
            <Route path="favorites" element={<FavoritesList />} />
            <Route
              path="favorites/products/:id"
              element={<FavoriteProductDetails />}
            />
            <Route path="my-carts" element={<MyCarts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  </StrictMode>
)
