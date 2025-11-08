'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Plus, Pencil, Trash2, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { productsApi } from '@/shared/api/products.api'
import { Product, CreateProductDto, UpdateProductDto } from '@/entities/product/model/types'
import { useToast } from '@/shared/ui/use-toast'
import { ProductForm } from '@/features/products/ui/product-form'
import { ProductViewDialog } from '@/features/products/ui/product-view-dialog'
import { formatPrice } from '@/shared/lib/utils'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  const loadProducts = async (page: number = 1) => {
    try {
      setIsLoading(true)
      const response = await productsApi.getAll({ page, limit: 20 })
      setProducts(response.data)
      setCurrentPage(response.meta.page)
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка загрузки',
        description: error.response?.data?.message || 'Не удалось загрузить товары',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(currentPage)
  }, [currentPage])

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

  const handleCreate = async (data: CreateProductDto) => {
    try {
      setIsFormLoading(true)
      await productsApi.create(data)
      toast({
        title: 'Товар создан',
        description: 'Товар успешно добавлен в каталог',
      })
      await loadProducts()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка создания',
        description: error.response?.data?.message || 'Не удалось создать товар',
      })
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleUpdate = async (data: UpdateProductDto) => {
    if (!selectedProduct) return

    try {
      setIsFormLoading(true)
      await productsApi.update(selectedProduct.id, data)
      toast({
        title: 'Товар обновлен',
        description: 'Изменения успешно сохранены',
      })
      await loadProducts()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка обновления',
        description: error.response?.data?.message || 'Не удалось обновить товар',
      })
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      await productsApi.delete(id)
      toast({
        title: 'Товар удален',
        description: 'Товар успешно удален из каталога',
      })
      await loadProducts()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка удаления',
        description: error.response?.data?.message || 'Не удалось удалить товар',
      })
    }
  }

  const openCreateForm = () => {
    setSelectedProduct(undefined)
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const openViewDialog = (product: Product) => {
    setViewProduct(product)
    setIsViewOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Товары</h1>
          <p className="text-muted-foreground">
            Управление каталогом товаров
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
          <CardDescription>
            Всего товаров: {total}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">Товары не найдены</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(product)}
                          title="Просмотр"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditForm(product)}
                          title="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination */}
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

      <ProductForm
        product={selectedProduct}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedProduct ? handleUpdate : handleCreate}
        isLoading={isFormLoading}
      />

      <ProductViewDialog
        product={viewProduct}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />
    </div>
  )
}

