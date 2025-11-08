export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  costPrice: number
  stock: number
  category: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  description?: string
  price: number
  costPrice: number
  stock: number
  category: string
  imageUrl?: string
}

export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  costPrice?: number
  stock?: number
  category?: string
  imageUrl?: string
}

export interface FilterProductsDto {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  limit?: number
}

