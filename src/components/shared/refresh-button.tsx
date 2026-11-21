import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RefreshButton({ fetching, onRefresh }: { fetching: boolean; onRefresh: () => void }) {
  return <Button variant="outline" disabled={fetching} onClick={onRefresh}><RefreshCw className={fetching ? 'animate-spin' : ''} />{fetching ? 'Atualizando…' : 'Atualizar'}</Button>
}
