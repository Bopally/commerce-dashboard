import { useState, useEffect } from 'react'
import { api } from '../../services/api.service'

export const useProduct = (id) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        // First check if it's a locally stored product (ID >= 1000)
        const localModifications = JSON.parse(
          localStorage.getItem('productModifications') || '{}'
        )

        if (localModifications[id]) {
          setProduct(localModifications[id])
          return
        }

        // If not local, fetch from API using the new centralized API
        const data = await api.request(api.endpoints.PRODUCTS.BY_ID(id))
        setProduct(data)
      } catch (err) {
        if (parseInt(id) >= 1000) {
          setError(
            'This is a fake product that was added locally but cannot be retrieved as it uses a public API'
          )
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  return { product, loading, error }
}
