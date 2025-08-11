import React, { useState, useEffect } from 'react'
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

  // Lifted state for all carts (indexed by user ID)
  const [userCarts, setUserCarts] = useState({})
  const [cartsLoading, setCartsLoading] = useState({})
  const [cartsError, setCartsError] = useState({})

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
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

  // Load carts for a specific user
  const loadUserCarts = async (userId) => {
    if (userCarts[userId]) {
      return // Already loaded
    }

    try {
      setCartsLoading(prev => ({ ...prev, [userId]: true }))
      setCartsError(prev => ({ ...prev, [userId]: null }))
      
      const data = await fetchData(`carts/user/${userId}`)
      setUserCarts(prev => ({
        ...prev,
        [userId]: data.carts || []
      }))
    } catch (err) {
      setCartsError(prev => ({
        ...prev,
        [userId]: err.message
      }))
    } finally {
      setCartsLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  // Get carts for a specific user
  const getUserCarts = (userId) => {
    return userCarts[userId] || []
  }

  // Get cart count for a specific user
  const getUserCartCount = (userId) => {
    const carts = getUserCarts(userId)
    return carts.length
  }

  // Check if user carts are loading
  const isUserCartsLoading = (userId) => {
    return cartsLoading[userId] || false
  }

  // Get cart error for a specific user
  const getUserCartsError = (userId) => {
    return cartsError[userId] || null
  }

  // Handlers object for prop drilling
  const handlers = {
    // Users data
    users,
    usersLoading,
    usersError,
    
    // Carts methods
    loadUserCarts,
    getUserCarts,
    getUserCartCount,
    isUserCartsLoading,
    getUserCartsError
  }

  return (
    <Routes>
      <Route index element={<UsersList handlers={handlers} />} />
      <Route path=":id" element={<UserProfile handlers={handlers} />} />
    </Routes>
  )
}