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
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        if (typeof Storage === 'undefined') {
          console.warn('localStorage is not supported in this browser')
          setIsLoaded(true)
          return
        }

        const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

        if (
          storedFavorites &&
          storedFavorites !== 'null' &&
          storedFavorites !== 'undefined'
        ) {
          const parsedFavorites = JSON.parse(storedFavorites)

          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites)
          } else {
            console.warn('Stored favorites is not an array, resetting...')
            localStorage.removeItem(FAVORITES_STORAGE_KEY)
            setFavorites([])
          }
        } else {
          setFavorites([])
        }
      } catch (error) {
        console.error('❌ Error loading favorites from localStorage:', error)
        // En cas d'erreur, nettoyer le localStorage
        try {
          localStorage.removeItem(FAVORITES_STORAGE_KEY)
        } catch (cleanupError) {
          console.error('Error cleaning up localStorage:', cleanupError)
        }
        setFavorites([])
      } finally {
        setIsLoaded(true)
      }
    }

    loadFavorites()
  }, [])

  // Save favorites to localStorage whenever favorites change (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        const favoritesToSave = JSON.stringify(favorites)
        localStorage.setItem(FAVORITES_STORAGE_KEY, favoritesToSave)

        const verification = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (verification !== favoritesToSave) {
          console.error('❌ Save verification failed!')
        }
      } catch (error) {
        console.error('❌ Error saving favorites to localStorage:', error)

        if (error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded!')
        }
      }
    }
  }, [favorites, isLoaded])

  // Check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some((product) => {
      return product.id == productId // Using == instead of === to handle string/number comparison
    })
  }

  // Add or remove product from favorites
  const toggleFavorite = (product) => {
    setFavorites((currentFavorites) => {
      const isCurrentlyFavorite = currentFavorites.some(
        (fav) => fav.id == product.id // Using == for type coercion
      )

      if (isCurrentlyFavorite) {
        // Remove from favorites
        return currentFavorites.filter((fav) => fav.id != product.id) // Using != for type coercion
      } else {
        // Add to favorites
        return [...currentFavorites, product]
      }
    })
  }

  // Add product to favorites (if not already added)
  const addToFavorites = (product) => {
    setFavorites((currentFavorites) => {
      const isAlreadyFavorite = currentFavorites.some(
        (fav) => fav.id == product.id
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
      currentFavorites.filter((fav) => fav.id != productId)
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
