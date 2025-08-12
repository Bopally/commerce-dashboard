import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homepage.page.js'
import { setupApiMocks } from './helpers/apiMocks.js'

test.describe('Homepage', () => {
  let homePage

  test.beforeEach(async ({ page }) => {
    // Setup API mocks before navigating to page
    await setupApiMocks(page)
    
    homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should load the homepage successfully', async ({ page }) => {
    // Check if page loads
    await expect(page).toHaveTitle(/E-commerce Project/)

    // Check if main title is visible
    await expect(homePage.pageTitle).toBeVisible()
    await expect(homePage.pageTitle).toContainText('Our products')
  })

  test('should display navigation links', async () => {
    // Check navigation links are visible
    await expect(homePage.homepageLink).toBeVisible()
    await expect(homePage.usersLink).toBeVisible()
    await expect(homePage.favoritesLink).toBeVisible()

    // Check favorites counter starts at 0
    await expect(homePage.favoritesLink).toContainText('💗 Favorites (0)')
  })

  test('should load and display products', async () => {
    // Wait for products to load
    await homePage.waitForPageLoad()

    // Check products grid is visible
    await expect(homePage.productsGrid).toBeVisible()

    // Check that exactly 3 mocked products are loaded
    const productCount = await homePage.getProductCount()
    expect(productCount).toBe(3)

    // Check product cards have required elements
    await expect(homePage.productImages.first()).toBeVisible()
    await expect(homePage.productTitles.first()).toBeVisible()
    await expect(homePage.productPrices.first()).toBeVisible()
    await expect(homePage.favoriteButtons.first()).toBeVisible()

    // Check specific product content from mock data
    await expect(homePage.productTitles.first()).toContainText('iPhone 12')
  })

  // test('should add and remove products from favorites', async () => {
  //   await homePage.waitForPageLoad()

  //   // Initial favorites count should be 0
  //   const initialCount = await homePage.getFavoritesCount()
  //   expect(initialCount).toBe(0)

  //   // Add first product to favorites
  //   await homePage.addToFavorites(0)

  //   // Wait and check favorites count increased
  //   await expect(homePage.favoritesLink).toContainText('💗 Favorites (1)')

  //   // Add another product to favorites
  //   await homePage.addToFavorites(1)
  //   await expect(homePage.favoritesLink).toContainText('💗 Favorites (2)')

  //   // Remove first product from favorites
  //   await homePage.addToFavorites(0)
  //   await expect(homePage.favoritesLink).toContainText('💗 Favorites (1)')
  // })

  // test('should navigate to product details', async ({ page }) => {
  //   await homePage.waitForPageLoad()

  //   // Click on first product
  //   await homePage.clickProduct(0)

  //   // Should navigate to product details page
  //   await expect(page).toHaveURL(/\/commerce-dashboard\/products\/\d+/)

  //   // Should show back button
  //   await expect(page.locator('.back-btn')).toBeVisible()
  // })

  // test('should display and interact with quote section', async ({ page }) => {
  //   await homePage.waitForPageLoad()

  //   // Check quote section is visible
  //   await expect(homePage.quoteContainer).toBeVisible()
  //   await expect(homePage.quoteText).toBeVisible()
  //   await expect(homePage.quoteAuthor).toBeVisible()
  //   await expect(homePage.quoteRefreshButton).toBeVisible()

  //   // Refresh quote
  //   await homePage.refreshQuote()

  //   // Wait a moment for potential change
  //   await page.waitForTimeout(1000)

  //   // Quote should still be visible (may or may not be different)
  //   await expect(homePage.quoteText).toBeVisible()
  // })

  // test('should navigate to users page', async ({ page }) => {
  //   await homePage.navigateToUsers()

  //   // Should navigate to users page
  //   await expect(page).toHaveURL('/commerce-dashboard/users')
  //   await expect(page.locator('h1')).toContainText('Our Users')
  // })

  // test('should navigate to favorites page', async ({ page }) => {
  //   await homePage.navigateToFavorites()

  //   // Should navigate to favorites page
  //   await expect(page).toHaveURL('/commerce-dashboard/favorites')
  //   await expect(page.locator('h1')).toContainText('My Favorites')
  // })

  // test('should be responsive on mobile devices', async ({ page }) => {
  //   // Set mobile viewport
  //   await page.setViewportSize({ width: 375, height: 667 })

  //   await homePage.waitForPageLoad()

  //   // Check that main elements are still visible on mobile
  //   await expect(homePage.pageTitle).toBeVisible()
  //   await expect(homePage.productsGrid).toBeVisible()

  //   // Check products are still displayed
  //   const productCount = await homePage.getProductCount()
  //   expect(productCount).toBeGreaterThan(0)
  // })

  // test('should handle loading states gracefully', async () => {
  //   // Navigate to homepage
  //   await homePage.goto()

  //   // Either loading spinner should appear briefly or content loads directly
  //   await homePage.waitForPageLoad()

  //   // Page should eventually show products or error state
  //   const hasProducts = await homePage.productsGrid.isVisible()
  //   const hasError = await homePage.errorState.isVisible()

  //   expect(hasProducts || hasError).toBe(true)
  // })
})
