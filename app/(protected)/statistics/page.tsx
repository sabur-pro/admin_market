import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { BarChart3, TrendingUp, Package, ShoppingCart } from 'lucide-react'

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Статистика</h1>
        <p className="text-muted-foreground">
          Аналитика и отчеты по работе магазина
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Выручка за месяц
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Скоро</div>
            <p className="text-xs text-muted-foreground">
              В разработке
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Заказов за месяц
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Скоро</div>
            <p className="text-xs text-muted-foreground">
              В разработке
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Популярных товаров
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Скоро</div>
            <p className="text-xs text-muted-foreground">
              В разработке
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Средний чек
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Скоро</div>
            <p className="text-xs text-muted-foreground">
              В разработке
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>График продаж</CardTitle>
            <CardDescription>
              Динамика продаж за последние 30 дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  График будет добавлен в следующем обновлении
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные категории</CardTitle>
            <CardDescription>
              Распределение продаж по категориям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Диаграмма будет добавлена в следующем обновлении
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о разделе</CardTitle>
          <CardDescription>
            Функционал статистики в разработке
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • В этом разделе будет доступна детальная статистика продаж
            </p>
            <p>
              • Графики и диаграммы для анализа бизнес-метрик
            </p>
            <p>
              • Отчеты по периодам и категориям
            </p>
            <p>
              • Аналитика поведения пользователей
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

