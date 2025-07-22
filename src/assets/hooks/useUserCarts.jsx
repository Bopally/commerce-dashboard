import { useState, useEffect } from 'react'
import { fetchData } from '../../services/api.service'

export const useUserCarts = (userId) => {
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUserCarts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchData(`carts/user/${userId}`)
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
