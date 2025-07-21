import ProductDetails from './ProductDetails.jsx'
import { useEffect } from 'react'
import { useFavorites } from '../../contexts/FavoritesContext'
import { useParams, useNavigate } from 'react-router-dom'

export const FavoriteProductDetails = () => {
  const { isFavorite, favorites } = useFavorites()
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Step 1 - check if the product is actually favorite
    if (!isFavorite(id)) {
      // Step 2 - redirect if the product is not favorite
      navigate(`/commerce-dashboard/products/${id}`)
    }
  }, [id, favorites, isFavorite, navigate])

  return <ProductDetails />
}
