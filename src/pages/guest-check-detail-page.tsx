import { Link, useParams } from 'react-router-dom'
import { useGuestCheck, useOrders } from '@/hooks/use-menu'
import { PageHeading } from '@/components/shared/page-heading'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/query-state'
import { RefreshButton } from '@/components/shared/refresh-button'
import { OrderCard } from '@/components/order-card'
import { currency, dateTime, shortId } from '@/lib/format'
import { totalForCheck } from '@/lib/orders'

export function GuestCheckDetailPage() {
  const { id = '' } = useParams()
  const check = useGuestCheck(id)
  const orders = useOrders(id)
  const refresh = () => { void check.refetch(); void orders.refetch() }
  return <>
    <Link to="/comandas" className="mb-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">Voltar para comandas</Link>
    <PageHeading title={check.data ? check.data.spot.name : 'Detalhe da comanda'} description={check.data ? `Comanda #${shortId(check.data.id)} · Aberta em ${dateTime(check.data.createdAt)}` : 'Consulte os pedidos e acompanhe o preparo.'} action={<RefreshButton fetching={check.isFetching || orders.isFetching} onRefresh={refresh} />} />
    {check.isPending || orders.isPending ? <LoadingState label="Carregando pedidos da comanda…" /> : check.isError || orders.isError ? <ErrorState error={check.error || orders.error} retry={refresh} /> : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-primary p-5 text-white"><p>{orders.data.length} pedido(s) nesta comanda</p><p className="flex items-baseline gap-4"><span className="text-sm text-white/80">Total acumulado</span><strong className="text-2xl tabular-nums">{currency(totalForCheck(orders.data, id))}</strong></p></div>
      {orders.data.length === 0 ? <EmptyState title="Esta comanda ainda não tem pedidos" description="Os pedidos da mesa serão exibidos aqui assim que forem registrados." /> : <div className="space-y-5">{orders.data.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
    </>}
  </>
}
