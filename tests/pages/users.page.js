export class UsersPage {
  constructor(page) {
    this.page = page

    // Page elements
    this.pageTitle = page.locator('h1')
    this.usersGrid = page.locator('.users-grid')
    this.userCards = page.locator('.user-card')
    this.loadingSpinner = page.locator('.loading-state')
    this.errorState = page.locator('.error-state')

    // User card elements
    this.userNames = page.locator('.user-name')
    this.userEmails = page.locator('.user-email')
    this.userCartCounts = page.locator('.user-cart-count')
    this.userAvatars = page.locator('.user-avatar')

    // Navigation
    this.backButton = page.locator('.back-btn')
  }

  async goto() {
    await this.page.goto('/commerce-dashboard/users')
  }

  async waitForUsers() {
    await this.usersGrid.waitFor({ state: 'visible' })
    await this.userCards.first().waitFor({ state: 'visible' })
  }

  async getUserCount() {
    await this.waitForUsers()
    return await this.userCards.count()
  }

  async clickUser(index = 0) {
    await this.userCards.nth(index).click()
  }

  async getUserWithCarts() {
    await this.waitForUsers()
    const userCards = await this.userCards.all()

    for (let i = 0; i < userCards.length; i++) {
      const cartCountElement = userCards[i].locator('.user-cart-count')
      if (await cartCountElement.isVisible()) {
        const cartText = await cartCountElement.textContent()
        const cartCount = parseInt(cartText.match(/\d+/)?.[0] || '0')
        if (cartCount > 0) {
          return i // Return index of user with carts
        }
      }
    }
    return -1 // No users with carts found
  }

  async getUserCartCount(index) {
    const cartCountElement = this.userCards
      .nth(index)
      .locator('.user-cart-count')
    if (await cartCountElement.isVisible()) {
      const cartText = await cartCountElement.textContent()
      return parseInt(cartText.match(/\d+/)?.[0] || '0')
    }
    return 0
  }

  async getUserName(index) {
    return await this.userNames.nth(index).textContent()
  }

  async waitForPageLoad() {
    await Promise.race([
      this.waitForUsers(),
      this.errorState.waitFor({ state: 'visible' }),
      this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }),
    ])
  }
}
