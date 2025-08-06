export class HomePage {
  constructor(page) {
    this.page = page

    // Navigation elements
    this.homepageLink = page.locator('nav .nav-link', {
      hasText: '🏠 Homepage',
    })
    this.usersLink = page.locator('nav .nav-link', { hasText: '👥 Users' })
    this.favoritesLink = page.locator('nav .nav-link', {
      hasText: '💗 Favorites',
    })

    // Homepage content
    this.pageTitle = page.locator('h1')
    this.productCards = page.locator('.product-card')
    this.productsGrid = page.locator('.products-grid')
    this.loadingSpinner = page.locator('.loading-state')
    this.errorState = page.locator('.error-state')

    // Product card elements
    this.productImages = page.locator('.product-image')
    this.productTitles = page.locator('.product-title')
    this.productPrices = page.locator('.product-price')
    this.favoriteButtons = page.locator('.favorite-btn')

    // Quote section
    this.quoteContainer = page.locator('.quote-container')
    this.quoteText = page.locator('.quote-text')
    this.quoteAuthor = page.locator('.quote-author')
    this.quoteRefreshButton = page.locator('.quote-refresh-bottom')
  }

  async goto() {
    await this.page.goto('/')
  }

  async waitForProducts() {
    await this.productsGrid.waitFor({ state: 'visible' })
    await this.productCards.first().waitFor({ state: 'visible' })
  }

  async getProductCount() {
    await this.waitForProducts()
    return await this.productCards.count()
  }

  async clickProduct(index = 0) {
    await this.productCards.nth(index).click()
  }

  async addToFavorites(index = 0) {
    await this.favoriteButtons.nth(index).click()
  }

  async navigateToUsers() {
    await this.usersLink.click()
  }

  async navigateToFavorites() {
    await this.favoritesLink.click()
  }

  async getFavoritesCount() {
    const favoritesText = await this.favoritesLink.textContent()
    const match = favoritesText.match(/\((\d+)\)/)
    return match ? parseInt(match[1]) : 0
  }

  async refreshQuote() {
    await this.quoteRefreshButton.click()
  }

  async waitForPageLoad() {
    // Wait for either products to load or an error state
    await this.waitForProducts()
  }
}
