import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './pages/Homepage/Homepage.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavoritesProvider>
      <Homepage />
    </FavoritesProvider>
  </StrictMode>
)
