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