import { test, expect } from '@playwright/test'
import { HomePage } from './pages/homepage.page.js'
import { setupApiMocks } from './helpers/apiMocks.js'

test.describe('Favorites Functionality', () => {
  let homePage

  test.beforeEach(async ({ page }) => {
    // Setup API mocks before navigating to page
    await setupApiMocks(page)
    
    homePage = new HomePage(page)
    await homePage.goto()
    await homePage.waitForPageLoad()
  })

  test('should start with empty favorites', async ({ page }) => {
    // Navigate to favorites page
    await homePage.navigateToFavorites()

    // Should show empty state
    await expect(page.locator('h1')).toContainText('My Favorites 💗 (0)')
    await expect(page.locator('.empty-state')).toBeVisible()
    await expect(page.locator('.empty-title')).toContainText('No favorites yet')
  })

  test('should add products to favorites from homepage', async () => {
    // Add first product to favorites
    await homePage.addToFavorites(0)

    // Check favorites counter updated
    await expect(homePage.favoritesLink).toContainText('💗 Favorites (1)')

    // Add second product to favorites
    await homePage.addToFavorites(1)
    await expect(homePage.favoritesLink).toContainText('💗 Favorites (2)')
  })

  test('should display favorites on favorites page', async ({ page }) => {
    // Add some products to favorites
    await homePage.addToFavorites(0)
    await homePage.addToFavorites(1)

    // Navigate to favorites page
    await homePage.navigateToFavorites()

    // Should show favorites
    await expect(page.locator('h1')).toContainText('My Favorites 💗 (2)')
    await expect(page.locator('.products-grid')).toBeVisible()

    // Should have product cards
    const favoriteCards = page.locator('.product-card')
    await expect(favoriteCards).toHaveCount(2)
  })

  test('should remove products from favorites', async ({ page }) => {
    // Add products to favorites
    await homePage.addToFavorites(0)
    await homePage.addToFavorites(1)

    // Navigate to favorites page
    await homePage.navigateToFavorites()

    // Remove first favorite
    await page.locator('.favorite-btn').first().click()

    // Should have one less favorite
    await expect(page.locator('h1')).toContainText('My Favorites 💗 (1)')

    // Remove last favorite
    await page.locator('.favorite-btn').first().click()

    // Should show empty state again
    await expect(page.locator('h1')).toContainText('My Favorites 💗 (0)')
    await expect(page.locator('.empty-state')).toBeVisible()
  })

  test('should persist favorites across page navigation', async () => {
    // Add favorites
    await homePage.addToFavorites(0)
    await homePage.addToFavorites(1)

    // Navigate to users page
    await homePage.navigateToUsers()

    // Navigate back to homepage
    await homePage.goto()
    await homePage.waitForPageLoad()

    // Favorites should still be there
    await expect(homePage.favoritesLink).toContainText('💗 Favorites (2)')
  })

  test('should show browse products button in empty favorites', async ({
    page,
  }) => {
    // Navigate to favorites page (should be empty)
    await homePage.navigateToFavorites()

    // Should show browse button
    const browseButton = page.locator('.browse-button')
    await expect(browseButton).toBeVisible()
    await expect(browseButton).toContainText('🛍️ Browse Products')

    // Click browse button should navigate to homepage
    await browseButton.click()
    await expect(page).toHaveURL('/commerce-dashboard')
    await expect(page.locator('h1')).toContainText('Our products')
  })

  test('should maintain favorites state when clicking products', async ({
    page,
  }) => {
    // Add a product to favorites
    await homePage.addToFavorites(0)

    // Click on the product to view details
    await homePage.clickProduct(0)

    // Should navigate to product details
    await expect(page).toHaveURL(/\/commerce-dashboard\/products\/\d+/)

    // Navigate back to homepage
    await page.locator('.back-btn').click()
    await homePage.waitForPageLoad()

    // Favorites should still be maintained
    await expect(homePage.favoritesLink).toContainText('💗 Favorites (1)')
  })

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Add favorites
    await homePage.addToFavorites(0)

    // Navigate to favorites
    await homePage.navigateToFavorites()

    // Should work on mobile
    await expect(page.locator('h1')).toContainText('My Favorites 💗 (1)')
    await expect(page.locator('.products-grid')).toBeVisible()
  })
})

test.describe('Cart Summary Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Setup API mocks for cart integration tests
    await setupApiMocks(page)
  })

  test('should display cart summaries in user profiles', async ({ page }) => {
    // Navigate to users page
    await page.goto('/commerce-dashboard/users')

    // Wait for users to load
    await page.locator('.users-grid').waitFor({ state: 'visible' })

    // Click on first user (Emily Johnson - has 1 cart in mock data)
    const userCards = await page.locator('.user-card').all()
    await userCards[0].click()

    // Wait for profile to load
    await page.locator('.user-profile-name').waitFor({ state: 'visible' })

    // Switch to summary view if carts exist
    const summaryButton = page.locator('.toggle-btn', {
      hasText: '📊 Summary',
    })
    if (await summaryButton.isVisible()) {
      await summaryButton.click()

      // Check cart summary components (Emily has 1 cart)
      await expect(page.locator('.carts-summary-grid')).toBeVisible()
      await expect(page.locator('.cart-summary')).toHaveCount(1)

      // Check cart summary elements
      await expect(
        page.locator('.cart-summary__title').first()
      ).toBeVisible()
      await expect(page.locator('.total-amount').first()).toBeVisible()
      await expect(page.locator('.summary-stat').first()).toBeVisible()
    }
  })

  test('should toggle between detailed and summary views', async ({ page }) => {
    // Navigate to users and find user with carts
    await page.goto('/commerce-dashboard/users')
    await page.locator('.users-grid').waitFor({ state: 'visible' })

    // Find first user with carts and click
    const userCards = await page.locator('.user-card').all()

    for (const userCard of userCards.slice(0, 10)) {
      const cartCountElement = userCard.locator('.user-cart-count')

      if (await cartCountElement.isVisible()) {
        const cartText = await cartCountElement.textContent()
        const cartCount = parseInt(cartText.match(/\d+/)?.[0] || '0')

        if (cartCount > 0) {
          await userCard.click()

          // Wait for profile to load
          await page.locator('.user-profile-name').waitFor({ state: 'visible' })

          // Should start in detailed view
          await expect(
            page.locator('.toggle-btn', { hasText: '📋 Detailed' })
          ).toHaveClass(/active/)
          await expect(page.locator('.carts-grid')).toBeVisible()

          // Switch to summary view
          await page.locator('.toggle-btn', { hasText: '📊 Summary' }).click()
          await expect(
            page.locator('.toggle-btn', { hasText: '📊 Summary' })
          ).toHaveClass(/active/)
          await expect(page.locator('.carts-summary-grid')).toBeVisible()

          // Switch back to detailed view
          await page.locator('.toggle-btn', { hasText: '📋 Detailed' }).click()
          await expect(
            page.locator('.toggle-btn', { hasText: '📋 Detailed' })
          ).toHaveClass(/active/)
          await expect(page.locator('.carts-grid')).toBeVisible()

          break
        }
      }
    }
  })

  test('should display correct cart statistics in summary view', async ({
    page,
  }) => {
    // Navigate to users and find user with carts
    await page.goto('/commerce-dashboard/users')
    await page.locator('.users-grid').waitFor({ state: 'visible' })

    // Find user with carts
    const userCards = await page.locator('.user-card').all()

    for (const userCard of userCards.slice(0, 5)) {
      const cartCountElement = userCard.locator('.user-cart-count')

      if (await cartCountElement.isVisible()) {
        const cartText = await cartCountElement.textContent()
        const cartCount = parseInt(cartText.match(/\d+/)?.[0] || '0')

        if (cartCount > 0) {
          await userCard.click()
          await page.locator('.user-profile-name').waitFor({ state: 'visible' })

          // Switch to summary view
          await page.locator('.toggle-btn', { hasText: '📊 Summary' }).click()
          await page
            .locator('.carts-summary-grid')
            .waitFor({ state: 'visible' })

          // Check first cart summary has required elements
          const firstCartSummary = page.locator('.cart-summary').first()

          // Check header elements
          await expect(
            firstCartSummary.locator('.cart-summary__title')
          ).toBeVisible()
          await expect(
            firstCartSummary.locator('.cart-summary__id')
          ).toBeVisible()

          // Check statistics
          await expect(firstCartSummary.locator('.summary-stat')).toHaveCount(
            3,
            { timeout: 5000 }
          )

          // Check total section
          await expect(firstCartSummary.locator('.total-amount')).toBeVisible()
          await expect(firstCartSummary.locator('.total-label')).toContainText(
            'Final Total'
          )

          break
        }
      }
    }
  })
})
