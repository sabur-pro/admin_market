'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { ordersApi, OrderFilters } from '@/shared/api/orders.api'
import { Order, OrderStatus } from '@/entities/order/model/types'
import { useToast } from '@/shared/ui/use-toast'
import { OrderStatusSelect } from '@/features/orders/ui/order-status-select'
import { formatPrice, formatDate } from '@/shared/lib/utils'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  const loadOrders = async (page: number = 1, status: OrderStatus | null = null) => {
    try {
      setIsLoading(true)
      const filters: OrderFilters = {
        page,
        limit: 10,
      }
      
      if (status) {
        filters.status = status
      }
      
      const response = await ordersApi.getAll(filters)
      setOrders(response.data)
      setCurrentPage(response.meta.page)
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки',
        description: error.response?.data?.message || 'Не удалось загрузить заказы',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders(currentPage, statusFilter)
  }, [currentPage, statusFilter])

  const handleStatusFilterChange = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') {
      setStatusFilter(null)
    } else {
      setStatusFilter(value as OrderStatus)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, { status: newStatus })
      toast({
        title: 'Статус обновлен',
        description: 'Статус заказа успешно изменен',
      })
      await loadOrders()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка обновления',
        description: error.response?.data?.message || 'Не удалось обновить статус',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Заказы</h1>
        <p className="text-muted-foreground">
          Управление заказами клиентов
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Список заказов</CardTitle>
              <CardDescription>
                Всего заказов: {total}
              </CardDescription>
            </div>
            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все заказы</SelectItem>
                <SelectItem value={OrderStatus.PENDING}>Ожидает</SelectItem>
                <SelectItem value={OrderStatus.PROCESSING}>В обработке</SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>Выполнен</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Отменён</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">Заказы не найдены</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Заказ #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription>
                          {order.user.firstName || order.user.lastName 
                            ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
                            : order.user.email} ({order.user.email})
                        </CardDescription>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <OrderStatusSelect
                        value={order.status}
                        onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Товар</TableHead>
                          <TableHead>Количество</TableHead>
                          <TableHead>Цена</TableHead>
                          <TableHead className="text-right">Сумма</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.product.name}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell className="text-right">
                              {formatPrice(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="font-bold">
                            Итого:
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Назад
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Вперёд
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

