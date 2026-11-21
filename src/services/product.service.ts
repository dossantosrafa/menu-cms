import { api } from '@/lib/axios'
import type { Product, ProductInput } from '@/types/api'

export const productService = {
  list: async (categoryId?: string) => (await api.get<Product[]>('/products', {
    params: { includeInactive: true, ...(categoryId ? { categoryId } : {}) },
  })).data,
  create: async (input: ProductInput) => (await api.post<Product>('/products', input)).data,
  update: async (id: string, input: ProductInput) => (await api.patch<Product>(`/products/${id}`, input)).data,
  remove: async (id: string) => { await api.delete(`/products/${id}`) },
}
