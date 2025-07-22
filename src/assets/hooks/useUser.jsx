import { useState, useEffect } from 'react'
import { fetchData } from '../../services/api.service'

export const useUser = (id) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchData(`users/${id}`)
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadUser()
    }
  }, [id])

  return { user, loading, error }
}
