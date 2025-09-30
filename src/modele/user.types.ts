export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
}

export interface UserCreateRequest {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export interface UserUpdateRequest {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
}