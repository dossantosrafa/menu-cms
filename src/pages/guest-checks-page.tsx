import { Link } from 'react-router-dom'
import { ClipboardList, ReceiptText, SquareMenu } from 'lucide-react'
import { useOpenedChecks, useOrders } from '@/hooks/use-menu'
import { PageHeading } from '@/components/shared/page-heading'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/query-state'
import { RefreshButton } from '@/components/shared/refresh-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { buttonVariants } from '@/components/ui/button'
import { currency, dateTime, shortId } from '@/lib/format'
import { totalForCheck } from '@/lib/orders'

export function GuestChecksPage() {
  const checks = useOpenedChecks()
  const orders = useOrders()
  const refresh = () => { void checks.refetch(); void orders.refetch() }
  const opened = checks.data?.filter((check) => check.status === 'OPENED') ?? []
  const openedIds = new Set(opened.map((check) => check.id))
  const currentOrders = orders.data?.filter((order) => openedIds.has(order.guestCheck.id)) ?? []
  const total = opened.reduce((sum, check) => sum + Math.round(totalForCheck(orders.data ?? [], check.id) * 100), 0) / 100
  return <>
    <PageHeading title="Comandas em aberto" description="Acompanhe o atendimento de cada mesa, do primeiro pedido à última entrega." action={<RefreshButton fetching={checks.isFetching || orders.isFetching} onRefresh={refresh} />} />
    {checks.isPending || orders.isPending ? <LoadingState label="Carregando comandas e pedidos…" /> : checks.isError || orders.isError ? <ErrorState error={checks.error || orders.error} retry={refresh} /> : <>
      <div className="mb-7 grid gap-4 sm:grid-cols-3">{[
        { label: 'Comandas abertas', value: opened.length, icon: SquareMenu },
        { label: 'Pedidos nas comandas', value: currentOrders.length, icon: ClipboardList },
        { label: 'Total acumulado', value: currency(total), icon: ReceiptText },
      ].map(({ label, value, icon: Icon }) => <Card key={label} className="py-0 shadow-none"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p></div><span className="flex size-11 items-center justify-center rounded-xl bg-secondary"><Icon className="size-5 text-primary" /></span></CardContent></Card>)}</div>
      {opened.length === 0 ? <EmptyState title="Tudo tranquilo por aqui" description="As comandas aparecem automaticamente quando uma mesa faz o primeiro pedido." /> :
        <div className="overflow-hidden rounded-xl border bg-card"><div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4"><h2 className="font-semibold">Atendimento no salão</h2><span className="text-xs text-muted-foreground">Atualização automática a cada 15 s</span></div>
          <Table><TableHeader><TableRow><TableHead className="pl-5">Mesa / comanda</TableHead><TableHead>Abertura</TableHead><TableHead>Situação</TableHead><TableHead className="text-right">Total acumulado</TableHead><TableHead className="pr-5 text-right">Detalhes</TableHead></TableRow></TableHeader><TableBody>{opened.map((check) => <TableRow key={check.id}><TableCell className="pl-5"><p className="font-semibold">{check.spot.name}</p><p className="mt-1 text-xs text-muted-foreground">#{shortId(check.id)}</p></TableCell><TableCell>{dateTime(check.createdAt)}</TableCell><TableCell><Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">Aberta</Badge></TableCell><TableCell className="text-right font-semibold tabular-nums">{currency(totalForCheck(orders.data ?? [], check.id))}</TableCell><TableCell className="pr-5 text-right"><Link className={buttonVariants({ variant: 'outline', size: 'sm' })} to={`/comandas/${check.id}`}>Ver pedidos<span className="sr-only"> de {check.spot.name}</span></Link></TableCell></TableRow>)}</TableBody></Table>
        </div>}
    </>}
  </>
}
