'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3,
  LogOut 
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { useAuthStore } from '@/shared/store/auth.store'
import { authApi } from '@/shared/api/auth.api'
import { useRouter } from 'next/navigation'

const menuItems = [
  {
    title: 'Главная',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Товары',
    href: '/products',
    icon: Package,
  },
  {
    title: 'Заказы',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Статистика',
    href: '/statistics',
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout: logoutStore } = useAuthStore()

  const handleLogout = () => {
    authApi.logout()
    logoutStore()
    router.push('/login')
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Market Admin</h2>
        {user && (
          <p className="mt-2 text-sm text-muted-foreground">
            {user.name}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Выйти
        </Button>
      </div>
    </div>
  )
}

