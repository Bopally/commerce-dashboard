const BASE_URL = 'https://dummyjson.com'

export const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error during login:', error)
    throw error
  }
}
