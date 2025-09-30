/**
 * Authentication utility functions
 */

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken')
}