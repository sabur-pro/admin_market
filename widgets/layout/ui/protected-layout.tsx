'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/store/auth.store'
import { authApi } from '@/shared/api/auth.api'
import { getAuthToken } from '@/shared/api/client'
import { Sidebar } from './sidebar'
import { Header } from './header'

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setUser, setLoading, isLoading, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken()
      
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      try {
        const user = await authApi.getProfile()
        
        if (user.role !== 'ADMIN') {
          authApi.logout()
          setUser(null)
          router.push('/login')
          return
        }
        
        setUser(user)
      } catch (error) {
        authApi.logout()
        setUser(null)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, setUser, setLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

