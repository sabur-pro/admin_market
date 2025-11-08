'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { OrderStatus } from '@/entities/order/model/types'

interface OrderStatusSelectProps {
  value: OrderStatus
  onChange: (value: OrderStatus) => void
  disabled?: boolean
}

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Ожидает подтверждения',
  [OrderStatus.PROCESSING]: 'В обработке',
  [OrderStatus.COMPLETED]: 'Выполнен',
  [OrderStatus.CANCELLED]: 'Отменен',
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'text-yellow-600',
  [OrderStatus.PROCESSING]: 'text-blue-600',
  [OrderStatus.COMPLETED]: 'text-green-600',
  [OrderStatus.CANCELLED]: 'text-red-600',
}

export function OrderStatusSelect({ value, onChange, disabled }: OrderStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span className={statusColors[value]}>
            {statusLabels[value]}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusLabels).map(([status, label]) => (
          <SelectItem key={status} value={status}>
            <span className={statusColors[status as OrderStatus]}>
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

