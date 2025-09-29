/**
 * Centralized API Service
 *
 * This service provides a centralized way to handle all API calls in the application.
 * It includes:
 * - Centralized HTTP client with proper error handling
 * - TypeScript interfaces for all request/response types
 * - Organized API endpoints and methods by resource
 * - Backward compatibility with existing code
 *
 * Usage:
 * - Use specific API modules (authApi, productsApi, usersApi, cartsApi) for new code
 * - Legacy functions (fetchData, loginUser, etc.) are still available for backward compatibility
 *
 * Example:
 * ```typescript
 * import { productsApi, authApi } from './api.service'
 *
 * // New way (recommended)
 * const products = await productsApi.getAll()
 * const user = await authApi.login({ username, password })
 *
 * // Legacy way (still works)
 * const products = await fetchData('products')
 * ```
 */

// API Configuration
const BASE_URL = 'https://dummyjson.com'

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
  },
  PRODUCTS: {
    LIST: 'products',
    BY_ID: (id: number) => `products/${id}`,
    ADD: 'products/add',
    UPDATE: (id: number) => `products/${id}`,
    DELETE: (id: number) => `products/${id}`,
  },
  USERS: {
    LIST: 'users',
    BY_ID: (id: number) => `users/${id}`,
  },
  CARTS: {
    USER_CARTS: (userId: number) => `carts/user/${userId}`,
  },
} as const

// TypeScript Interfaces
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  accessToken: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  thumbnail?: string
  rating?: number
  discountPercentage?: number
}

export interface ProductUpdateRequest {
  title: string
  price: number
}

export interface ProductCreateRequest {
  title: string
  description: string
  price: number
  category: string
  brand: string
  stock: number
  thumbnail?: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

export interface Cart {
  id: number
  userId: number
  products: Array<{
    id: number
    title: string
    price: number
    quantity: number
  }>
}

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: any
  headers?: Record<string, string> | undefined
}

// Core API Client
class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`
  }

  private getHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    const authToken = this.getAuthToken()
    return {
      ...this.defaultHeaders,
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...customHeaders,
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    try {
      return await response.json()
    } catch (error) {
      throw new Error('Failed to parse response as JSON')
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const url = this.buildUrl(endpoint)
    const requestHeaders = this.getHeaders(headers)

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      ...(body && { body: JSON.stringify(body) }),
    }

    try {
      const response = await fetch(url, requestOptions)
      return await this.handleResponse<T>(response)
    } catch (error) {
      console.error(`API request failed for ${method} ${endpoint}:`, error)
      throw error
    }
  }

  // Convenience methods for each HTTP verb
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

// Create API client instance
const apiClient = new ApiClient(BASE_URL)

// Authentication API
export const authApi = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials)
  },
}

// Products API
export const productsApi = {
  getAll: (): Promise<{ products: Product[] }> => {
    return apiClient.get<{ products: Product[] }>(ENDPOINTS.PRODUCTS.LIST)
  },

  getById: (id: number): Promise<Product> => {
    return apiClient.get<Product>(ENDPOINTS.PRODUCTS.BY_ID(id))
  },

  create: (productData: ProductCreateRequest): Promise<Product> => {
    return apiClient.post<Product>(ENDPOINTS.PRODUCTS.ADD, productData)
  },

  update: (id: number, productData: ProductUpdateRequest): Promise<Product> => {
    return apiClient.put<Product>(ENDPOINTS.PRODUCTS.UPDATE(id), productData)
  },

  delete: (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    return apiClient.delete<{ id: number; isDeleted: boolean }>(
      ENDPOINTS.PRODUCTS.DELETE(id)
    )
  },
}

// Users API
export const usersApi = {
  getAll: (): Promise<{ users: User[] }> => {
    return apiClient.get<{ users: User[] }>(ENDPOINTS.USERS.LIST)
  },

  getById: (id: number): Promise<User> => {
    return apiClient.get<User>(ENDPOINTS.USERS.BY_ID(id))
  },
}

// Carts API
export const cartsApi = {
  getUserCarts: (userId: number): Promise<{ carts: Cart[] }> => {
    return apiClient.get<{ carts: Cart[] }>(ENDPOINTS.CARTS.USER_CARTS(userId))
  },
}

// Legacy exports for backward compatibility
export const fetchData = async (endpoint: string) => {
  return apiClient.get(endpoint)
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  return authApi.login({ username, password })
}
export const updateProduct = productsApi.update
export const createProduct = productsApi.create
