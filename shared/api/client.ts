import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://135.125.182.46:3000'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
  }
}

const removeCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; path=/; max-age=0`
  }
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = getCookie('access_token') || localStorage.getItem('access_token')
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('[Admin Auth] Received 401 error, checking tokens...')
          if (originalRequest.url?.includes('/auth/refresh')) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              removeCookie('access_token')
              removeCookie('refresh_token')
              window.location.href = '/login'
            }
            return Promise.reject(error)
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return this.client(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          isRefreshing = true

          const refreshToken = typeof window !== 'undefined' 
            ? (getCookie('refresh_token') || localStorage.getItem('refresh_token'))
            : null

          if (!refreshToken) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              removeCookie('access_token')
              removeCookie('refresh_token')
              window.location.href = '/login'
            }
            return Promise.reject(error)
          }

          try {
            console.log('[Admin Auth] Attempting to refresh access token...')
            const response = await axios.post(
              `${API_URL}/auth/refresh`,
              { refreshToken },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
              }
            )

            const { access_token, refresh_token } = response.data

            if (!access_token || !refresh_token) {
              throw new Error('Invalid token response')
            }

            console.log('[Admin Auth] Token refresh successful')

            if (typeof window !== 'undefined') {
              setCookie('access_token', access_token, 60 * 1) 
              setCookie('refresh_token', refresh_token, 60 * 60 * 24 * 7) 
              
              localStorage.setItem('access_token', access_token)
              localStorage.setItem('refresh_token', refresh_token)
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`
            }

            processQueue(null, access_token)
            isRefreshing = false

            return this.client(originalRequest)
          } catch (err: any) {
            console.error('[Admin Auth] Token refresh failed:', err.response?.status, err.message)
            processQueue(err as Error, null)
            isRefreshing = false


            if (err.response?.status === 401 || err.response?.status === 403) {
              console.log('[Admin Auth] Refresh token invalid, redirecting to login')
              if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                removeCookie('access_token')
                removeCookie('refresh_token')
                window.location.href = '/login'
              }
            }

            return Promise.reject(err)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url)
    return response.data
  }
}

export const apiClient = new ApiClient()

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return getCookie('access_token') || localStorage.getItem('access_token')
  }
  return null
}

export const setAuthTokens = (access_token: string, refresh_token: string) => {
  if (typeof window !== 'undefined') {
    setCookie('access_token', access_token, 60 * 1) 
    setCookie('refresh_token', refresh_token, 60 * 60 * 24 * 7) 
    
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
  }
}

export const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    removeCookie('access_token')
    removeCookie('refresh_token')
  }
}

