import { api } from '@/lib/axios'
import type { Order, OrderStatus } from '@/types/api'

export const orderService = {
  list: async (guestCheckId?: string) => (await api.get<Order[]>('/orders', {
    params: guestCheckId ? { guestCheckId } : undefined,
  })).data,
  updateStatus: async (id: string, status: OrderStatus) => (await api.patch<Order>(`/orders/${id}/status`, { status })).data,
}
