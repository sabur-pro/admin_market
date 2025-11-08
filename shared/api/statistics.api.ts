import { apiClient } from './client'

export interface DashboardStats {
  totalProducts: number
  activeOrders: number
  totalUsers: number
  revenue: {
    total: number
    profit: number
    period: string
  }
  completedOrdersCount: number
}

export interface RevenueStats {
  period: 'week' | 'month' | 'year'
  startDate: string
  endDate: string
  ordersCount: number
  revenue: number
  cost: number
  profit: number
  profitMargin: number
}

export const statisticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/statistics/dashboard')
  },

  getRevenueByPeriod: async (period: 'week' | 'month' | 'year' = 'month'): Promise<RevenueStats> => {
    return apiClient.get<RevenueStats>('/statistics/revenue', { period })
  },
}

