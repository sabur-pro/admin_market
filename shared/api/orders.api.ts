import { apiClient } from './client'
import { Order, UpdateOrderStatusDto, OrderStatus } from '@/entities/order/model/types'

export interface OrderFilters {
  status?: OrderStatus
  page?: number
  limit?: number
}

export interface PaginatedOrdersResponse {
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export const ordersApi = {
  getAll: async (filters?: OrderFilters): Promise<PaginatedOrdersResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    return apiClient.get<PaginatedOrdersResponse>(`/orders/admin/all?${params.toString()}`)
  },

  getById: async (id: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/admin/${id}`)
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDto): Promise<Order> => {
    return apiClient.patch<Order>(`/orders/${id}/status`, data)
  },
}

