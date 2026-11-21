export interface Category {
  id: string
  name: string
  icon: string | null
  displayOrder: number
  active: boolean
}

export type CategoryInput = Omit<Category, 'id'>

export interface Product {
  id: string
  name: string
  description: string | null
  price: number | string
  picture: string | null
  active: boolean
  isVegetarian: boolean
  isNew: boolean
  category: Category | null
}

export interface ProductInput {
  name: string
  description: string
  price: number
  picture: string | null
  active: boolean
  isVegetarian: boolean
  isNew: boolean
  categoryId: string
}

export interface Spot {
  id: string
  name: string
  active: boolean
}

export type SpotInput = Omit<Spot, 'id'>
export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERED'

export interface GuestCheck {
  id: string
  createdAt: string
  status: 'OPENED' | 'CLOSED'
  spot: Spot
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number | string
  subtotal: number | string
}

export interface Order {
  id: string
  createdAt: string
  status: OrderStatus
  total: number | string
  guestCheck: GuestCheck
  items: OrderItem[]
}
