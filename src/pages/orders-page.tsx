import { useOrders, useOpenedChecks } from '@/hooks/use-menu'
import { PageHeading } from '@/components/shared/page-heading'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/query-state'
import { RefreshButton } from '@/components/shared/refresh-button'
import { OrderKanban } from '@/components/order-kanban'

export function OrdersPage() {
  const query = useOrders()
  const checks = useOpenedChecks()
  const opened = new Set(checks.data?.filter((check) => check.status === 'OPENED').map((check) => check.id))
  const orders = query.data?.filter((order) => opened.has(order.guestCheck.id)) ?? []
  const refresh = () => { void query.refetch(); void checks.refetch() }
  return <>
    <PageHeading title="Pedidos" description="Arraste os cartões entre as etapas ou use “Mover para”. Cada alteração é salva na operação." action={<RefreshButton fetching={query.isFetching || checks.isFetching} onRefresh={refresh} />} />
    {query.isPending || checks.isPending ? <LoadingState label="Carregando o quadro de pedidos…" /> : query.isError || checks.isError ? <ErrorState error={query.error || checks.error} retry={refresh} /> : orders.length === 0 ? <EmptyState title="Nenhum pedido nas comandas abertas" description="Os pedidos aparecem neste quadro assim que são registrados. O status permanece salvo ao recarregar a página." /> : <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground"><span>{orders.length} pedido(s) nas comandas abertas</span><span>Atualização automática a cada 15 s</span></div>
      <OrderKanban orders={orders} />
    </>}
  </>
}
