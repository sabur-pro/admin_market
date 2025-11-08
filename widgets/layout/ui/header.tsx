'use client'

import { useAuthStore } from '@/shared/store/auth.store'

export function Header() {
  const { user } = useAuthStore()

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Панель администратора</h1>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

