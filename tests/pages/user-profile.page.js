export class UserProfilePage {
  constructor(page) {
    this.page = page

    // Navigation
    this.backButton = page.locator('.back-btn')

    // User details section
    this.userAvatar = page.locator('.user-profile-avatar')
    this.userName = page.locator('.user-profile-name')
    this.userEmail = page.locator('.user-profile-email')
    this.detailItems = page.locator('.detail-item')

    // Carts section
    this.cartsTitle = page.locator('.carts-title')
    this.viewToggle = page.locator('.view-toggle')
    this.detailedButton = page.locator('.toggle-btn', {
      hasText: '📋 Detailed',
    })
    this.summaryButton = page.locator('.toggle-btn', { hasText: '📊 Summary' })

    // Cart displays
    this.cartsGrid = page.locator('.carts-grid')
    this.cartsSummaryGrid = page.locator('.carts-summary-grid')
    this.cartCards = page.locator('.cart-card')
    this.cartSummaries = page.locator('.cart-summary')

    // Cart details
    this.cartTitles = page.locator('.cart-title, .cart-summary__title')
    this.cartTotals = page.locator('.cart-total, .total-amount')
    this.cartProducts = page.locator('.cart-product, .summary-product')

    // Empty states
    this.emptyState = page.locator('.empty-state')
    this.loadingSpinner = page.locator('.loading-state')
    this.errorState = page.locator('.error-state')
  }

  async goto(userId) {
    await this.page.goto(`/commerce-dashboard/users/${userId}`)
  }

  async waitForProfile() {
    await this.userName.waitFor({ state: 'visible' })
    await this.userAvatar.waitFor({ state: 'visible' })
  }

  async getUserName() {
    return await this.userName.textContent()
  }

  async getUserEmail() {
    return await this.userEmail.textContent()
  }

  async getCartCount() {
    const cartsTitleText = await this.cartsTitle.textContent()
    const match = cartsTitleText.match(/\((\d+)\)/)
    return match ? parseInt(match[1]) : 0
  }

  async switchToSummaryView() {
    await this.summaryButton.click()
    await this.cartsSummaryGrid.waitFor({ state: 'visible' })
  }

  async switchToDetailedView() {
    await this.detailedButton.click()
    await this.cartsGrid.waitFor({ state: 'visible' })
  }

  async isDetailedViewActive() {
    return await this.detailedButton
      .getAttribute('class')
      .then((cls) => cls.includes('active'))
  }

  async isSummaryViewActive() {
    return await this.summaryButton
      .getAttribute('class')
      .then((cls) => cls.includes('active'))
  }

  async getCartSummariesCount() {
    if (await this.cartsSummaryGrid.isVisible()) {
      return await this.cartSummaries.count()
    }
    return 0
  }

  async getCartCardsCount() {
    if (await this.cartsGrid.isVisible()) {
      return await this.cartCards.count()
    }
    return 0
  }

  async hasEmptyState() {
    return await this.emptyState.isVisible()
  }

  async goBack() {
    await this.backButton.click()
  }

  async waitForPageLoad() {
    await Promise.race([
      this.waitForProfile(),
      this.errorState.waitFor({ state: 'visible' }),
      this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }),
    ])
  }

  async getDetailItemText(label) {
    const detailItems = await this.detailItems.all()
    for (const item of detailItems) {
      const text = await item.textContent()
      if (text.includes(label)) {
        return text
      }
    }
    return null
  }
}
