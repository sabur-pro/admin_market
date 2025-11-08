'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Product } from '@/entities/product/model/types'
import { formatPrice, getImageUrl } from '@/shared/lib/utils'
import Image from 'next/image'

interface ProductViewDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductViewDialog({
  product,
  open,
  onOpenChange,
}: ProductViewDialogProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Просмотр товара</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {product.imageUrl && (
            <div className="relative w-full h-64 border rounded-md overflow-hidden bg-gray-50">
              <Image
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Название</h3>
              <p className="mt-1 text-lg font-semibold">{product.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Категория</h3>
              <p className="mt-1 text-lg">{product.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Цена продажи</h3>
              <p className="mt-1 text-lg font-semibold">{formatPrice(product.price)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Себестоимость</h3>
              <p className="mt-1 text-lg">{formatPrice(product.costPrice)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Прибыль с единицы</h3>
              <p className={`mt-1 text-lg font-semibold ${product.price - product.costPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.price - product.costPrice >= 0 
                  ? `+${formatPrice(product.price - product.costPrice)}`
                  : `${formatPrice(product.price - product.costPrice)} (Убыток)`
                }
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Количество на складе</h3>
              <p className="mt-1 text-lg">{product.stock} шт.</p>
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Описание</h3>
              <p className="mt-1 text-base">{product.description}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <h3 className="font-medium text-muted-foreground">Создан</h3>
              <p className="mt-1">{new Date(product.createdAt).toLocaleString('ru-RU')}</p>
            </div>

            <div>
              <h3 className="font-medium text-muted-foreground">Обновлен</h3>
              <p className="mt-1">{new Date(product.updatedAt).toLocaleString('ru-RU')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

