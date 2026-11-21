import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategories, useCategoryMutations } from '@/hooks/use-menu'
import { PageHeading } from '@/components/shared/page-heading'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/query-state'
import { ActiveBadge } from '@/components/shared/active-badge'
import { ImagePreview } from '@/components/shared/image-preview'
import { RowActions } from '@/components/shared/row-actions'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { CategoryForm } from '@/components/category-form'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import type { Category } from '@/types/api'

export function CategoriesPage() {
  const query = useCategories()
  const { save, remove } = useCategoryMutations()
  const [editor, setEditor] = useState<{ record: Category | null } | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  return <>
    <PageHeading title="Categorias" description="Organize o cardápio por grupos, na ordem que faz sentido para o seu restaurante." action={<Button onClick={() => { save.reset(); setEditor({ record: null }) }}><Plus />Nova categoria</Button>} />
    {query.isPending ? <LoadingState /> : query.isError ? <ErrorState error={query.error} retry={() => void query.refetch()} /> : query.data.length === 0 ? <EmptyState title="Seu cardápio começa aqui" description="Cadastre a primeira categoria para organizar os produtos." /> :
      <div className="overflow-hidden rounded-xl border bg-card"><div className="border-b px-5 py-4"><h2 className="font-semibold">Categorias cadastradas <span className="ml-2 text-sm font-normal text-muted-foreground">{query.data.length}</span></h2></div>
        <Table><TableHeader><TableRow><TableHead className="pl-5">Ícone</TableHead><TableHead>Nome</TableHead><TableHead>Ordem</TableHead><TableHead>Situação</TableHead><TableHead className="pr-5 text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>{query.data.map((category) => <TableRow key={category.id}><TableCell className="pl-5"><ImagePreview key={category.icon} src={category.icon} alt={category.name} /></TableCell><TableCell className="font-medium">{category.name}</TableCell><TableCell>{category.displayOrder}</TableCell><TableCell><ActiveBadge active={category.active} /></TableCell>
            <TableCell className="pr-4"><RowActions name={category.name} onEdit={() => { save.reset(); setEditor({ record: category }) }} onDelete={() => { remove.reset(); setDeleting(category) }} /></TableCell></TableRow>)}</TableBody></Table>
      </div>}
    {editor ? <CategoryForm key={editor.record?.id ?? 'new'} category={editor.record} pending={save.isPending} error={save.error} onClose={() => setEditor(null)} onSave={(data) => save.mutate({ id: editor.record?.id, data }, { onSuccess: () => setEditor(null) })} /> : null}
    <DeleteDialog name={deleting?.name ?? null} pending={remove.isPending} error={remove.error} onCancel={() => setDeleting(null)} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
  </>
}
