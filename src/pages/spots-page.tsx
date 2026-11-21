import { useState } from 'react'
import { Plus, SquareMenu } from 'lucide-react'
import { useSpots, useSpotMutations } from '@/hooks/use-menu'
import { PageHeading } from '@/components/shared/page-heading'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/query-state'
import { ActiveBadge } from '@/components/shared/active-badge'
import { RowActions } from '@/components/shared/row-actions'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { SpotForm } from '@/components/spot-form'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import type { Spot } from '@/types/api'

export function SpotsPage() {
  const query = useSpots()
  const { save, remove } = useSpotMutations()
  const [editor, setEditor] = useState<{ record: Spot | null } | null>(null)
  const [deleting, setDeleting] = useState<Spot | null>(null)
  return <>
    <PageHeading title="Mesas" description="Gerencie os locais de atendimento e a disponibilidade para receber pedidos." action={<Button onClick={() => { save.reset(); setEditor({ record: null }) }}><Plus />Nova mesa</Button>} />
    {query.isPending ? <LoadingState /> : query.isError ? <ErrorState error={query.error} retry={() => void query.refetch()} /> : query.data.length === 0 ? <EmptyState title="Prepare o salão" description="Cadastre as mesas que estarão disponíveis no restaurante." /> :
      <div className="overflow-hidden rounded-xl border bg-card"><div className="border-b px-5 py-4"><h2 className="font-semibold">Mesas cadastradas <span className="ml-2 text-sm font-normal text-muted-foreground">{query.data.length}</span></h2></div>
        <Table><TableHeader><TableRow><TableHead className="pl-5">Mesa</TableHead><TableHead>Situação</TableHead><TableHead className="pr-5 text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>{query.data.map((spot) => <TableRow key={spot.id}><TableCell className="pl-5"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-lg bg-secondary"><SquareMenu className="size-5 text-primary" /></span><span className="font-medium">{spot.name}</span></div></TableCell><TableCell><ActiveBadge active={spot.active} /></TableCell>
            <TableCell className="pr-4"><RowActions name={spot.name} onEdit={() => { save.reset(); setEditor({ record: spot }) }} onDelete={() => { remove.reset(); setDeleting(spot) }} /></TableCell></TableRow>)}</TableBody></Table>
      </div>}
    {editor ? <SpotForm key={editor.record?.id ?? 'new'} spot={editor.record} pending={save.isPending} error={save.error} onClose={() => setEditor(null)} onSave={(data) => save.mutate({ id: editor.record?.id, data }, { onSuccess: () => setEditor(null) })} /> : null}
    <DeleteDialog name={deleting?.name ?? null} pending={remove.isPending} error={remove.error} onCancel={() => setDeleting(null)} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
  </>
}
