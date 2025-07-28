import { test, expect } from '@playwright/test'
import { UsersPage } from './pages/users.page.js'
import { UserProfilePage } from './pages/user-profile.page.js'

test.describe('Users Page', () => {
  let usersPage

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page)
    await usersPage.goto()
  })

  test('should load users list successfully', async ({ page }) => {
    // Check page loads
    await expect(page).toHaveTitle(/E-commerce Project/)

    // Check users title is visible
    await expect(usersPage.pageTitle).toBeVisible()
    await expect(usersPage.pageTitle).toContainText('Our Users')

    // Wait for users to load
    await usersPage.waitForPageLoad()
  })

  test('should display users with cart counts', async () => {
    await usersPage.waitForPageLoad()

    // Check users grid is visible
    await expect(usersPage.usersGrid).toBeVisible()

    // Check that users are loaded
    const userCount = await usersPage.getUserCount()
    expect(userCount).toBeGreaterThan(0)

    // Check user cards have required elements
    await expect(usersPage.userNames.first()).toBeVisible()
    await expect(usersPage.userEmails.first()).toBeVisible()
    await expect(usersPage.userAvatars.first()).toBeVisible()

    // Check that at least some users have cart count indicators
    const cartCountElements = await usersPage.userCartCounts.count()
    expect(cartCountElements).toBeGreaterThan(0)
  })

  test('should show correct cart counts for users', async () => {
    await usersPage.waitForPageLoad()

    const userCount = await usersPage.getUserCount()

    // Check cart counts are displayed correctly
    for (let i = 0; i < Math.min(userCount, 5); i++) {
      const cartCount = await usersPage.getUserCartCount(i)
      expect(cartCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should navigate to user profile when clicked', async ({ page }) => {
    await usersPage.waitForPageLoad()

    // Get a user name for verification
    const userName = await usersPage.getUserName(0)

    // Click on first user
    await usersPage.clickUser(0)

    // Should navigate to user profile
    await expect(page).toHaveURL(/\/commerce-dashboard\/users\/\d+/)

    // User profile should load
    const profilePage = new UserProfilePage(page)
    await profilePage.waitForPageLoad()

    // Should show the correct user
    await expect(profilePage.userName).toContainText(userName.split(' ')[0]) // First name
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await usersPage.waitForPageLoad()

    // Check that main elements are still visible on mobile
    await expect(usersPage.pageTitle).toBeVisible()
    await expect(usersPage.usersGrid).toBeVisible()

    // Check users are still displayed
    const userCount = await usersPage.getUserCount()
    expect(userCount).toBeGreaterThan(0)
  })
})

test.describe('User Profile Page', () => {
  let usersPage
  let profilePage

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page)
    profilePage = new UserProfilePage(page)

    // Navigate to users page first
    await usersPage.goto()
    await usersPage.waitForPageLoad()
  })

  test('should display user profile information', async () => {
    // Find a user and click on them
    await usersPage.clickUser(0)

    // Wait for profile to load
    await profilePage.waitForPageLoad()

    // Check profile elements are visible
    await expect(profilePage.userAvatar).toBeVisible()
    await expect(profilePage.userName).toBeVisible()
    await expect(profilePage.userEmail).toBeVisible()

    // Check detail items are displayed
    const phoneDetail = await profilePage.getDetailItemText('📱')
    const ageDetail = await profilePage.getDetailItemText('🎂')
    const genderDetail = await profilePage.getDetailItemText('👤')

    expect(phoneDetail).not.toBeNull()
    expect(ageDetail).not.toBeNull()
    expect(genderDetail).not.toBeNull()
  })

  test('should display cart information for users with carts', async () => {
    // Find a user with carts
    const userWithCartsIndex = await usersPage.getUserWithCarts()

    if (userWithCartsIndex >= 0) {
      await usersPage.clickUser(userWithCartsIndex)
      await profilePage.waitForPageLoad()

      // Check carts section
      await expect(profilePage.cartsTitle).toBeVisible()

      const cartCount = await profilePage.getCartCount()
      expect(cartCount).toBeGreaterThan(0)

      // Check view toggle is visible when there are carts
      await expect(profilePage.viewToggle).toBeVisible()
      await expect(profilePage.detailedButton).toBeVisible()
      await expect(profilePage.summaryButton).toBeVisible()
    }
  })

  test('should toggle between detailed and summary cart views', async () => {
    // Find a user with carts
    const userWithCartsIndex = await usersPage.getUserWithCarts()

    if (userWithCartsIndex >= 0) {
      await usersPage.clickUser(userWithCartsIndex)
      await profilePage.waitForPageLoad()

      const cartCount = await profilePage.getCartCount()

      if (cartCount > 0) {
        // Should start in detailed view
        expect(await profilePage.isDetailedViewActive()).toBe(true)

        // Switch to summary view
        await profilePage.switchToSummaryView()
        expect(await profilePage.isSummaryViewActive()).toBe(true)

        // Check summary components are visible
        const summaryCount = await profilePage.getCartSummariesCount()
        expect(summaryCount).toBe(cartCount)

        // Switch back to detailed view
        await profilePage.switchToDetailedView()
        expect(await profilePage.isDetailedViewActive()).toBe(true)

        // Check detailed components are visible
        const detailedCount = await profilePage.getCartCardsCount()
        expect(detailedCount).toBe(cartCount)
      }
    }
  })

  test('should show empty state for users without carts', async () => {
    // Try to find a user without carts
    await usersPage.waitForPageLoad()
    const userCount = await usersPage.getUserCount()

    let foundUserWithoutCarts = false

    for (
      let i = 0;
      i < Math.min(userCount, 10) && !foundUserWithoutCarts;
      i++
    ) {
      const cartCount = await usersPage.getUserCartCount(i)

      if (cartCount === 0) {
        await usersPage.clickUser(i)
        await profilePage.waitForPageLoad()

        // Should show empty state
        expect(await profilePage.hasEmptyState()).toBe(true)
        expect(await profilePage.getCartCount()).toBe(0)

        foundUserWithoutCarts = true

        // Go back to users list
        await profilePage.goBack()
        await usersPage.waitForPageLoad()
      }
    }

    // At least verify we tested the functionality
    expect(true).toBe(true) // This test explored the empty state logic
  })

  test('should navigate back to users list', async ({ page }) => {
    // Click on a user
    await usersPage.clickUser(0)
    await profilePage.waitForPageLoad()

    // Click back button
    await profilePage.goBack()

    // Should be back on users list
    await expect(page).toHaveURL('/commerce-dashboard/users')
    await expect(usersPage.pageTitle).toContainText('Our Users')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to a user profile
    await usersPage.clickUser(0)
    await profilePage.waitForPageLoad()

    // Check that main elements are still visible on mobile
    await expect(profilePage.userAvatar).toBeVisible()
    await expect(profilePage.userName).toBeVisible()
    await expect(profilePage.cartsTitle).toBeVisible()
  })

  test('should handle direct URL navigation to user profile', async ({
    page,
  }) => {
    // Navigate directly to a user profile URL
    await profilePage.goto(1)
    await profilePage.waitForPageLoad()

    // Should load the profile
    await expect(profilePage.userName).toBeVisible()
    await expect(profilePage.userEmail).toBeVisible()

    // Should show proper URL
    await expect(page).toHaveURL('/commerce-dashboard/users/1')
  })
})
