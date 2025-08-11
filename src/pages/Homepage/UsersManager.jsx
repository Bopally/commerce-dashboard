import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { fetchData } from '../../services/api.service'
import { UsersList } from './UsersList'
import UserProfile from './UserProfile'

// Parent component managing lifted state for users and carts
export const UsersManager = () => {
  // Lifted state for users
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState(null)

  // Lifted state for all carts (as a flat array)
  const [allCarts, setAllCarts] = useState([])
  const [cartsLoading, setCartsLoading] = useState(false)
  const [cartsError, setCartsError] = useState(null)
  const usersLoadedRef = useRef(false)
  const cartsLoadedRef = useRef(false)

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      if (usersLoadedRef.current) return
      usersLoadedRef.current = true

      try {
        setUsersLoading(true)
        setUsersError(null)
        const data = await fetchData('users')
        setUsers(data.users || [])
      } catch (err) {
        setUsersError(err.message)
      } finally {
        setUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Load all carts as flat array (user's preferred approach)
  const loadAllCarts = useCallback(async () => {
    if (cartsLoadedRef.current) return
    cartsLoadedRef.current = true

    try {
      setCartsLoading(true)
      setCartsError(null)
      const data = await fetchData('carts')
      setAllCarts(data.carts || [])
    } catch (err) {
      console.error('Failed to load all carts:', err)
      setCartsError(err.message)
    } finally {
      setCartsLoading(false)
    }
  }, [])

  // Load carts for a specific user (fallback for individual user profile)
  const loadUserCarts = useCallback(async () => {
    // Load all carts if not already loaded
    await loadAllCarts()
  }, [loadAllCarts])

  // Get carts for a specific user using filter (user's preferred approach)
  const getUserCarts = (userId) => {
    return allCarts.filter(cart => cart.userId === parseInt(userId))
  }

  // Get cart count for a specific user using filter
  const getUserCartCount = (userId) => {
    return allCarts.filter(cart => cart.userId === parseInt(userId)).length
  }

  // Check if user carts are loading (simplified since we load all at once)
  const isUserCartsLoading = () => {
    return cartsLoading
  }

  // Get cart error for a specific user (simplified since we load all at once)
  const getUserCartsError = () => {
    return cartsError
  }

  // Get specific user from already loaded users (avoid duplicate API calls)
  const getUser = (userId) => {
    return users.find(user => user.id === parseInt(userId))
  }

  // Handlers object for prop drilling
  const handlers = {
    // Users data
    users,
    usersLoading,
    usersError,
    getUser,

    // Carts methods
    loadUserCarts,
    loadAllCarts,
    getUserCarts,
    getUserCartCount,
    isUserCartsLoading,
    getUserCartsError,
  }

  return (
    <Routes>
      <Route index element={<UsersList handlers={handlers} />} />
      <Route path=":id" element={<UserProfile handlers={handlers} />} />
    </Routes>
  )
}
