import { apiClient, setAuthTokens, clearAuthTokens } from './client'
import { LoginCredentials, LoginResponse, User } from '@/entities/user/model/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    if (response.access_token && response.refresh_token) {
      setAuthTokens(response.access_token, response.refresh_token)
    }
    return response
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/auth/profile')
  },

  logout: () => {
    clearAuthTokens()
  },
}

