import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/axios'
import { categoryService } from '@/services/category.service'
import { productService } from '@/services/product.service'
import { spotService } from '@/services/spot.service'
import { guestCheckService } from '@/services/guest-check.service'
import { orderService } from '@/services/order.service'
import type { CategoryInput, ProductInput, SpotInput, OrderStatus } from '@/types/api'

export const queryKeys = {
  categories: ['categories'] as const,
  products: ['products'] as const,
  spots: ['spots'] as const,
  guestChecks: ['guest-checks'] as const,
  orders: ['orders'] as const,
}

export const useCategories = () => useQuery({ queryKey: queryKeys.categories, queryFn: categoryService.list })
export const useProducts = (categoryId?: string) => useQuery({
  queryKey: [...queryKeys.products, categoryId ?? 'all'],
  queryFn: () => productService.list(categoryId),
})
export const useSpots = () => useQuery({ queryKey: queryKeys.spots, queryFn: spotService.list })
export const useOpenedChecks = () => useQuery({
  queryKey: [...queryKeys.guestChecks, 'OPENED'], queryFn: guestCheckService.listOpened, refetchInterval: 15_000,
})
export const useGuestCheck = (id: string) => useQuery({
  queryKey: [...queryKeys.guestChecks, id], queryFn: () => guestCheckService.findOne(id), enabled: Boolean(id),
})
export const useOrders = (guestCheckId?: string) => useQuery({
  queryKey: [...queryKeys.orders, guestCheckId ?? 'all'],
  queryFn: () => orderService.list(guestCheckId), refetchInterval: 15_000,
})

interface CrudService<T> {
  create: (input: T) => Promise<unknown>
  update: (id: string, input: T) => Promise<unknown>
  remove: (id: string) => Promise<void>
}

function useCrudMutations<T>(service: CrudService<T>, affected: readonly string[], label: string) {
  const client = useQueryClient()
  const ending = label === 'Produto' ? 'o' : 'a'
  const invalidate = () => Promise.all(affected.map((key) => client.invalidateQueries({ queryKey: [key] })))
  const save = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: T }) => id ? service.update(id, data) : service.create(data),
    onSuccess: async (_, variables) => {
      await invalidate()
      toast.success(`${label} ${variables.id ? `atualizad${ending}` : `cadastrad${ending}`} com sucesso.`)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
  const remove = useMutation({
    mutationFn: service.remove,
    onSuccess: async () => { await invalidate(); toast.success(`${label} excluíd${ending} com sucesso.`) },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
  return { save, remove }
}

export const useCategoryMutations = () => useCrudMutations<CategoryInput>(categoryService, ['categories', 'products'], 'Categoria')
export const useProductMutations = () => useCrudMutations<ProductInput>(productService, ['products', 'orders'], 'Produto')
export const useSpotMutations = () => useCrudMutations<SpotInput>(spotService, ['spots', 'guest-checks', 'orders'], 'Mesa')

export function useOrderStatus() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => orderService.updateStatus(id, status),
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.orders }),
        client.invalidateQueries({ queryKey: queryKeys.guestChecks }),
      ])
      toast.success('Status do pedido atualizado.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
