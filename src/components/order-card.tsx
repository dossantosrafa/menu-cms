import { Clock3 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { useOrderStatus } from '@/hooks/use-menu'
import { orderStatuses, statusLabels, statusStyles, isOrderStatus } from '@/lib/orders'
import { currency, dateTime, shortId } from '@/lib/format'
import type { Order } from '@/types/api'

export function OrderCard({ order }: { order: Order }) {
  const mutation = useOrderStatus()
  return <Card className="gap-0 overflow-hidden py-0 shadow-none"><CardHeader className="gap-4 border-b bg-muted/30 p-5 sm:flex sm:flex-row sm:items-center sm:justify-between">
    <div><div className="flex items-center gap-3"><h2 className="font-semibold">Pedido #{shortId(order.id)}</h2><Badge variant="outline" className={statusStyles[order.status]}>{statusLabels[order.status]}</Badge></div><p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><Clock3 className="size-3.5" />{dateTime(order.createdAt)}</p></div>
    <div className="min-w-44 space-y-1.5"><Label htmlFor={`status-${order.id}`}>Alterar status</Label><NativeSelect id={`status-${order.id}`} value={order.status} disabled={mutation.isPending} onChange={(event) => { const status = event.target.value; if (isOrderStatus(status) && status !== order.status) mutation.mutate({ id: order.id, status }) }}>{orderStatuses.map((status) => <NativeSelectOption key={status} value={status}>{statusLabels[status]}</NativeSelectOption>)}</NativeSelect></div>
  </CardHeader><CardContent className="p-0">
    {order.items.length ? <Table><TableHeader><TableRow><TableHead className="pl-5">Produto</TableHead><TableHead className="text-center">Qtd.</TableHead><TableHead className="text-right">Preço unitário</TableHead><TableHead className="pr-5 text-right">Subtotal</TableHead></TableRow></TableHeader><TableBody>{order.items.map((item) => <TableRow key={item.id}><TableCell className="pl-5 font-medium">{item.product.name}</TableCell><TableCell className="text-center">{item.quantity}</TableCell><TableCell className="text-right tabular-nums">{currency(item.price)}</TableCell><TableCell className="pr-5 text-right tabular-nums">{currency(item.subtotal)}</TableCell></TableRow>)}</TableBody></Table> : <p className="p-5 text-sm text-muted-foreground">Este pedido não possui itens.</p>}
    <div className="flex justify-end gap-6 border-t p-5"><span className="text-sm text-muted-foreground">Total do pedido</span><strong className="tabular-nums">{currency(order.total)}</strong></div>
  </CardContent></Card>
}
