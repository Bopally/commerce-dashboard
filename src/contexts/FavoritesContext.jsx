import React, { createContext, useContext, useState, useEffect } from 'react'

const FAVORITES_STORAGE_KEY = 'favoriteProducts'

// Create the context
const FavoritesContext = createContext()

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

// Favorites provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
      setFavorites([])
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }, [favorites])

  // Check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some((product) => product.id === productId)
  }

  // Add or remove product from favorites
  const toggleFavorite = (product) => {
    console.log('Toggling favorite for product:', product.title)
    setFavorites((currentFavorites) => {
      console.log('Current favorites:', currentFavorites.length)
      const isCurrentlyFavorite = currentFavorites.some(
        (fav) => fav.id === product.id
      )

      if (isCurrentlyFavorite) {
        // Remove from favorites
        console.log('Removing from favorites')
        const newFavorites = currentFavorites.filter(
          (fav) => fav.id !== product.id
        )
        console.log('New favorites count:', newFavorites.length)
        return newFavorites
      } else {
        // Add to favorites
        console.log('Adding to favorites')
        const newFavorites = [...currentFavorites, product]
        console.log('New favorites count:', newFavorites.length)
        return newFavorites
      }
    })
  }

  // Add product to favorites (if not already added)
  const addToFavorites = (product) => {
    setFavorites((currentFavorites) => {
      const isAlreadyFavorite = currentFavorites.some(
        (fav) => fav.id === product.id
      )
      if (!isAlreadyFavorite) {
        return [...currentFavorites, product]
      }
      return currentFavorites
    })
  }

  // Remove product from favorites
  const removeFromFavorites = (productId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((fav) => fav.id !== productId)
    )
  }

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([])
  }

  const value = {
    favorites,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
