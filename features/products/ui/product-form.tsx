'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Product } from '@/entities/product/model/types'
import { uploadApi } from '@/shared/api/upload.api'
import { useToast } from '@/shared/ui/use-toast'
import { getImageUrl } from '@/shared/lib/utils'
import Image from 'next/image'

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  costPrice: z.number().min(0, 'Себестоимость не может быть отрицательной'),
  stock: z.number().int().min(0, 'Количество не может быть отрицательным'),
  category: z.string().min(1, 'Категория обязательна'),
  imageUrl: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProductFormData) => Promise<void>
  isLoading: boolean
}

export function ProductForm({
  product,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || '',
          price: product.price,
          costPrice: product.costPrice,
          stock: product.stock,
          category: product.category,
          imageUrl: product.imageUrl || '',
        }
      : undefined,
  })

  const priceValue = watch('price') || 0
  const costPriceValue = watch('costPrice') || 0
  const profit = priceValue - costPriceValue

  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        category: product.category,
        imageUrl: product.imageUrl || '',
      })
      
      if (product.imageUrl) {
        setPreviewUrl(getImageUrl(product.imageUrl))
      }
    } else if (open && !product) {
      reset({
        name: '',
        description: '',
        price: 0,
        costPrice: 0,
        stock: 0,
        category: '',
        imageUrl: '',
      })
      setPreviewUrl(null)
    }
    setSelectedFile(null)
  }, [product, open, reset])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Файл слишком большой',
          description: 'Размер файла не должен превышать 5MB',
        })
        return
      }

      if (!file.type.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
        toast({
          variant: 'destructive',
          title: 'Неверный формат',
          description: 'Разрешены только изображения (JPG, PNG, GIF, WEBP)',
        })
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      if (selectedFile) {
        setUploadingImage(true)
        const uploadResult = await uploadApi.uploadProductImage(selectedFile)
        data.imageUrl = uploadResult.imageUrl
        setUploadingImage(false)
      }

      await onSubmit(data)
      reset()
      setSelectedFile(null)
      setPreviewUrl(null)
      onOpenChange(false)
    } catch (error: any) {
      setUploadingImage(false)
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить товар',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Измените информацию о товаре'
              : 'Заполните информацию о новом товаре'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                placeholder="iPhone 15 Pro"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Input
                id="category"
                placeholder="Электроника"
                {...register('category')}
                disabled={isLoading}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              placeholder="Подробное описание товара"
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Цена продажи (сомонӣ) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="99999.99"
                {...register('price', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Себестоимость (сомонӣ) *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                placeholder="50000.00"
                {...register('costPrice', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.costPrice && (
                <p className="text-sm text-destructive">{errors.costPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stock">Количество *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="100"
                {...register('stock', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Прибыль с единицы</Label>
              <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? `+${profit.toFixed(2)} сомонӣ` : `${profit.toFixed(2)} сомонӣ (Убыток)`}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Изображение товара</Label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={isLoading || uploadingImage}
            />
            {previewUrl && (
              <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setSelectedFile(null)
                setPreviewUrl(null)
                onOpenChange(false)
              }}
              disabled={isLoading || uploadingImage}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading || uploadingImage}>
              {uploadingImage ? 'Загрузка изображения...' : isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

