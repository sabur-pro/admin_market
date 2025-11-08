export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    imageUrl: string | null
  }
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
}

