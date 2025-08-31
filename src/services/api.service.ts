const BASE_URL = 'https://dummyjson.com'
// To Do: rework the api service: could be centralize the calls

const apiAction = async (url, options = {}, errorOptions = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(errorOptions.message, error)
    throw error
  }
}

export const fetchData = async (endpoint: string) => {
  return await apiAction(
    `${BASE_URL}/${endpoint}`,
    {},
    { message: 'Error fetching data:' }
  )
}

export const loginUser = async (username: string, password: string) => {
  return await apiAction(
    `${BASE_URL}/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    },
    {
      message: 'Error logging in',
    }
  )
}

export const updateProduct = async (
  id: number,
  productData: { title: string; price: number }
) => {
  return await apiAction(
    `${BASE_URL}/products/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(productData),
    },
    {
      message: 'Error updating product:',
    }
  )
}

export const createProduct = async (productData: {
  title: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  thumbnail?: string
}) => {
  return await apiAction(
    `${BASE_URL}/products/add`,
    {
      method: 'POST',
      body: JSON.stringify(productData),
    },
    {
      message: 'Error creating product:',
    }
  )
}
