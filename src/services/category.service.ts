import { api } from '@/lib/axios'
import type { Category, CategoryInput } from '@/types/api'

export const categoryService = {
  list: async () => (await api.get<Category[]>('/categories')).data,
  create: async (input: CategoryInput) => (await api.post<Category>('/categories', input)).data,
  update: async (id: string, input: CategoryInput) => (await api.patch<Category>(`/categories/${id}`, input)).data,
  remove: async (id: string) => { await api.delete(`/categories/${id}`) },
}
