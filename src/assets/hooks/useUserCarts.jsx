import { useState, useEffect } from 'react'
import { api } from '../../services/api.service'

export const useUserCarts = (userId) => {
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUserCarts = async () => {
      try {
        setLoading(true)
        setError(null)
        // Using the new centralized API
        const data = await api.request(api.endpoints.CARTS.USER_CARTS(userId))
        setCarts(data.carts || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadUserCarts()
    }
  }, [userId])

  return { carts, loading, error }
}
