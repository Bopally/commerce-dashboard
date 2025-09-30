import { useState, useEffect } from 'react'
import { api } from '../../services/api.service'

export const useUser = (id) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        // Using the new centralized API
        const data = await api.request(api.endpoints.USERS.BY_ID(id))
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
