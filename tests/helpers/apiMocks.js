import { mockProducts, mockUsers, mockUserCarts, mockQuotes } from '../fixtures/mockData.js'

export const setupApiMocks = async (page) => {
  // Mock products endpoint
  await page.route('**/dummyjson.com/products*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts)
    })
  })

  // Mock users endpoint
  await page.route('**/dummyjson.com/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUsers)
    })
  })

  // Mock individual user carts endpoint
  await page.route('**/dummyjson.com/users/*/carts*', async (route) => {
    const url = route.request().url()
    const userIdMatch = url.match(/users\/(\d+)\/carts/)
    const userId = userIdMatch ? userIdMatch[1] : '1'
    
    const userCarts = mockUserCarts[userId] || { carts: [] }
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(userCarts)
    })
  })

  // Mock quotes endpoint
  await page.route('**/dummyjson.com/quotes*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockQuotes)
    })
  })

  // Mock single product endpoint
  await page.route('**/dummyjson.com/products/*', async (route) => {
    const url = route.request().url()
    const productIdMatch = url.match(/products\/(\d+)/)
    const productId = productIdMatch ? parseInt(productIdMatch[1]) : 1
    
    const product = mockProducts.products.find(p => p.id === productId) || mockProducts.products[0]
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(product)
    })
  })

  // Mock single user endpoint
  await page.route('**/dummyjson.com/users/*', async (route) => {
    const url = route.request().url()
    const userIdMatch = url.match(/users\/(\d+)$/)
    const userId = userIdMatch ? parseInt(userIdMatch[1]) : 1
    
    const user = mockUsers.users.find(u => u.id === userId) || mockUsers.users[0]
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user)
    })
  })
}