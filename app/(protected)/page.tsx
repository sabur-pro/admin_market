'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from 'lucide-react'
import { statisticsApi, DashboardStats } from '@/shared/api/statistics.api'
import { formatPrice } from '@/shared/lib/utils'
import { useToast } from '@/shared/ui/use-toast'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await statisticsApi.getDashboardStats()
      setStats(data)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки статистики',
        description: error.response?.data?.message || 'Не удалось загрузить данные',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Главная панель</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в панель администратора
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего товаров
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              В каталоге магазина
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные заказы
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : stats?.activeOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              В обработке и ожидании
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Пользователи
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : stats?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Зарегистрированных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Выручка (месяц)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : formatPrice(stats?.revenue.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              За последний месяц
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Детальная статистика</CardTitle>
            <CardDescription>
              Прибыль за последний месяц
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Выручка</span>
                  </div>
                  <span className="text-lg font-bold">{formatPrice(stats?.revenue.total || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Прибыль</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(stats?.revenue.profit || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Завершённых заказов</span>
                  </div>
                  <span className="text-lg font-bold">{stats?.completedOrdersCount || 0}</span>
                </div>
                {stats && stats.revenue.total > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground">Маржа прибыли</div>
                    <div className="text-xl font-bold text-green-600">
                      {((stats.revenue.profit / stats.revenue.total) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Основные операции администратора
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Управление товарами в разделе &quot;Товары&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              • Обработка заказов в разделе &quot;Заказы&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              • Просмотр статистики в разделе &quot;Статистика&quot;
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Недавняя активность</CardTitle>
            <CardDescription>
              Последние изменения в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Данные скоро появятся...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

