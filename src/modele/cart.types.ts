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

export interface CartCreateRequest {
  userId: number
  products: Array<{
    id: number
    quantity: number
  }>
}

export interface CartUpdateRequest {
  merge?: boolean
  products: Array<{
    id: number
    quantity: number
  }>
}