import type { ReactNode } from 'react'
import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, useDraggable, useDroppable, closestCorners, type DragEndEvent } from '@dnd-kit/core'
import { Clock3, GripVertical } from 'lucide-react'
import { useOrderStatus } from '@/hooks/use-menu'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'
import { orderStatuses, statusLabels, statusStyles, isOrderStatus } from '@/lib/orders'
import { currency, shortId, time } from '@/lib/format'
import type { Order, OrderStatus } from '@/types/api'

function KanbanColumn({ status, count, disabled, children }: { status: OrderStatus; count: number; disabled: boolean; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status, disabled })
  return <section ref={setNodeRef} aria-label={`Coluna ${statusLabels[status]}`} className={cn('min-h-80 min-w-0 rounded-xl border bg-muted/70 p-3 transition-colors', isOver && 'border-primary bg-emerald-100/70 ring-2 ring-primary/30')}>
    <div className="mb-4 flex items-center justify-between gap-2 px-1 pt-1"><h2><Badge variant="outline" className={cn('text-sm font-semibold', statusStyles[status])}>{statusLabels[status]}</Badge></h2><span className="flex size-6 items-center justify-center rounded-md bg-card text-xs font-semibold tabular-nums">{count}</span></div>
    <div className="space-y-3">{children}{count === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">Nenhum pedido</p> : null}</div>
  </section>
}

function Ticket({ order, disabled, overlay = false, onStatus }: { order: Order; disabled: boolean; overlay?: boolean; onStatus?: (status: OrderStatus) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: overlay ? `overlay-${order.id}` : order.id, disabled: disabled || overlay })
  return <Card ref={setNodeRef} style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined} className={cn('gap-0 py-0 shadow-xs', isDragging && 'opacity-25', overlay && 'rotate-2 shadow-lg')}>
    <CardContent className="p-4"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{order.guestCheck.spot.name}</p><p className="mt-1 text-xs text-muted-foreground">Pedido #{shortId(order.id)}</p></div>
      <button type="button" {...attributes} {...listeners} disabled={disabled || overlay} aria-label={`Arrastar pedido ${shortId(order.id)}`} className="-mt-1 -mr-1 touch-none rounded p-2 text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><GripVertical className="size-4" /></button></div>
      <ul className="my-4 space-y-2 text-sm">{order.items.map((item) => <li key={item.id} className="flex gap-2"><span className="shrink-0 font-semibold text-primary">{item.quantity}×</span><span className="break-words">{item.product.name}</span></li>)}</ul>
      <div className="flex items-center justify-between gap-2 border-t pt-3 text-sm"><span className="flex items-center gap-1 text-muted-foreground"><Clock3 className="size-3.5" />{time(order.createdAt)}</span><strong className="tabular-nums">{currency(order.total)}</strong></div>
      {!overlay ? <div className="mt-4 space-y-1.5"><Label className="text-xs" htmlFor={`kanban-status-${order.id}`}>Mover para</Label><NativeSelect id={`kanban-status-${order.id}`} value={order.status} disabled={disabled} onChange={(event) => { if (isOrderStatus(event.target.value)) onStatus?.(event.target.value) }}>
        {orderStatuses.map((status) => <NativeSelectOption key={status} value={status}>{statusLabels[status]}</NativeSelectOption>)}
      </NativeSelect></div> : null}
    </CardContent>
  </Card>
}

export function OrderKanban({ orders }: { orders: Order[] }) {
  const mutation = useOrderStatus()
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor))
  const activeOrder = orders.find((order) => order.id === activeId)
  function move(order: Order, status: OrderStatus) {
    if (order.status !== status && !mutation.isPending) mutation.mutate({ id: order.id, status })
  }
  function dragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    const order = orders.find((item) => item.id === active.id)
    if (order && over && isOrderStatus(over.id)) move(order, over.id)
  }
  return <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={({ active }) => setActiveId(String(active.id))} onDragCancel={() => setActiveId(null)} onDragEnd={dragEnd} accessibility={{
    screenReaderInstructions: { draggable: 'Para mover um pedido, pressione espaço na alça e use as setas. Pressione espaço para soltar ou Escape para cancelar. Você também pode usar o campo Mover para.' },
  }}>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-busy={mutation.isPending}>{orderStatuses.map((status) => {
      const items = orders.filter((order) => order.status === status)
      return <KanbanColumn key={status} status={status} count={items.length} disabled={mutation.isPending}>{items.map((order) => <Ticket key={order.id} order={order} disabled={mutation.isPending} onStatus={(next) => move(order, next)} />)}</KanbanColumn>
    })}</div>
    <DragOverlay>{activeOrder ? <Ticket order={activeOrder} disabled overlay /> : null}</DragOverlay>
  </DndContext>
}
