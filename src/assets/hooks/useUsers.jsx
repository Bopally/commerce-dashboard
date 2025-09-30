import { useState, useEffect } from 'react'
import { api } from '../../services/api.service'

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        // Using the new centralized API
        const data = await api.request(api.endpoints.USERS.LIST)
        setUsers(data.users || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return { users, loading, error }
}
