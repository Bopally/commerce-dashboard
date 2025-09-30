/**
 * Centralized API Service
 *
 * This service provides a centralized way to handle all API calls in the application.
 * It includes:
 * - Centralized HTTP client with proper error handling
 * - Organized API endpoints
 * - Single request method for all operations
 *
 * Usage:
 * ```typescript
 * import { api } from './api.service'
 *
 * // GET request
 * const products = await api.request(api.endpoints.PRODUCTS.LIST)
 * const user = await api.request(api.endpoints.USERS.BY_ID(1))
 *
 * // POST request
 * const newProduct = await api.request(api.endpoints.PRODUCTS.ADD, {
 *   method: 'POST',
 *   body: productData
 * })
 *
 * // Authentication
 * const loginResponse = await api.request(api.endpoints.AUTH.LOGIN, {
 *   method: 'POST',
 *   body: { username, password }
 * })
 * ```
 */

import { getAuthToken } from './auth.service.ts'

// API Configuration
const BASE_URL = 'https://dummyjson.com'

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REFRESH: 'auth/refresh',
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
    ADD: 'users/add',
    UPDATE: (id: number) => `users/${id}`,
    DELETE: (id: number) => `users/${id}`,
  },
  CARTS: {
    LIST: 'carts',
    BY_ID: (id: number) => `carts/${id}`,
    USER_CARTS: (userId: number) => `carts/user/${userId}`,
    ADD: 'carts/add',
    UPDATE: (id: number) => `carts/${id}`,
    DELETE: (id: number) => `carts/${id}`,
  },
} as const

// Import types from modele folder
import type {
  LoginResponse
} from '../modele/index.ts'

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  method: HttpMethod
  body?: any
  headers: Record<string, string>
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


  async request<T>(endpoint: string, options: Partial<RequestOptions> = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options
    const authToken = getAuthToken()

    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method,
      headers: {
        ...this.defaultHeaders,
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

}

// Create API client instance
const apiClient = new ApiClient(BASE_URL)

// Centralized API object
export const api = {
  // Direct client access for all requests
  request: apiClient.request.bind(apiClient),
  // Endpoints for reference
  endpoints: ENDPOINTS,
} as const

// Legacy exports for backward compatibility
export const fetchData = async (endpoint: string) => {
  return apiClient.request(endpoint)
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  return api.request<LoginResponse>(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: { username, password }
  })
}
export const updateProduct = (id: number, data: any) =>
  api.request(ENDPOINTS.PRODUCTS.UPDATE(id), { method: 'PUT', body: data })
export const createProduct = (data: any) =>
  api.request(ENDPOINTS.PRODUCTS.ADD, { method: 'POST', body: data })
