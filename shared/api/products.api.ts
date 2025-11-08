import { apiClient } from './client'
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '@/entities/product/model/types'

export interface PaginatedProductsResponse {
  data: Product[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
  }
}

export const productsApi = {
  getAll: async (filters?: FilterProductsDto): Promise<PaginatedProductsResponse> => {
    return apiClient.get<PaginatedProductsResponse>('/products', filters)
  },

  getById: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`)
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    return apiClient.post<Product>('/products', data)
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    return apiClient.patch<Product>(`/products/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/products/${id}`)
  },
}

