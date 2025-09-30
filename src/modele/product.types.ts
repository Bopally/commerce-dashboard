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