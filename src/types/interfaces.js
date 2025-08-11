/**
 * @typedef {Object} UserAddress
 * @property {string} city - The user's city
 * @property {string} state - The user's state
 */

/**
 * @typedef {Object} UserCompany
 * @property {string} name - Company name
 * @property {string} title - Job title
 */

/**
 * @typedef {Object} User
 * @property {number} id - Unique user identifier
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 * @property {string} phone - User's phone number
 * @property {number} age - User's age
 * @property {string} gender - User's gender
 * @property {string} bloodGroup - User's blood group
 * @property {string} image - URL to user's profile image
 * @property {UserAddress} [address] - User's address (optional)
 * @property {UserCompany} [company] - User's company info (optional)
 */

/**
 * @typedef {Object} CartProduct
 * @property {number} id - Product ID
 * @property {string} title - Product title/name
 * @property {number} price - Product price
 * @property {number} quantity - Quantity in cart
 * @property {string} thumbnail - URL to product thumbnail image
 */

/**
 * @typedef {Object} Cart
 * @property {number} id - Unique cart identifier
 * @property {number} userId - ID of the user who owns this cart
 * @property {number} total - Total cart value before discounts
 * @property {number} discountedTotal - Total cart value after discounts
 * @property {CartProduct[]} products - Array of products in the cart
 */

/**
 * @typedef {Object} UserHandlers
 * @property {User[]} users - Array of all users
 * @property {boolean} usersLoading - Whether users are currently loading
 * @property {string|null} usersError - Error message if users failed to load
 * @property {(userId: string|number) => User|undefined} getUser - Get a specific user by ID
 * @property {() => Promise<void>} loadUserCarts - Load carts for current user
 * @property {() => Promise<void>} loadAllCarts - Load all carts
 * @property {(userId: string|number) => Cart[]} getUserCarts - Get carts for a specific user
 * @property {(userId: string|number) => number} getUserCartCount - Get cart count for a specific user
 * @property {() => boolean} isUserCartsLoading - Check if user carts are loading
 * @property {() => string|null} getUserCartsError - Get cart loading error
 */

export {};