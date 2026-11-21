import type { Order, OrderStatus } from '@/types/api'

export const orderStatuses: OrderStatus[] = ['NEW', 'PREPARING', 'READY', 'DELIVERED']
export const statusLabels: Record<OrderStatus, string> = {
  NEW: 'Novo', PREPARING: 'Em preparo', READY: 'Pronto', DELIVERED: 'Entregue',
}
export const statusStyles: Record<OrderStatus, string> = {
  NEW: 'border-blue-200 bg-blue-50 text-blue-800',
  PREPARING: 'border-amber-200 bg-amber-50 text-amber-900',
  READY: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  DELIVERED: 'border-slate-200 bg-slate-100 text-slate-700',
}

export function totalForCheck(orders: Order[], guestCheckId: string): number {
  // Os valores numeric do PostgreSQL chegam como string; somar em centavos evita concatenação e ruído decimal.
  return orders.filter((order) => order.guestCheck.id === guestCheckId)
    .reduce((cents, order) => cents + Math.round(Number(order.total) * 100), 0) / 100
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return orderStatuses.some((status) => status === value)
}
