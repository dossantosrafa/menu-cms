import { useState } from 'react'
import { Leaf, Plus, Search, Sparkles } from 'lucide-react'
import { useCategories, useProducts, useProductMutations } from '@/hooks/use-menu'
import { PageHeading } from '@/components/shared/page-heading'
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/query-state'
import { ActiveBadge } from '@/components/shared/active-badge'
import { ImagePreview } from '@/components/shared/image-preview'
import { RowActions } from '@/components/shared/row-actions'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { ProductForm } from '@/components/product-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { currency } from '@/lib/format'
import type { Product } from '@/types/api'

export function ProductsPage() {
  const [categoryId, setCategoryId] = useState('')
  const [search, setSearch] = useState('')
  const categories = useCategories()
  const query = useProducts(categoryId || undefined)
  const { save, remove } = useProductMutations()
  const [editor, setEditor] = useState<{ record: Product | null } | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const products = query.data?.filter((product) => product.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))) ?? []
  const canCreate = categories.data?.some((category) => category.active) ?? false
  return <>
    <PageHeading title="Produtos" description="Cuide de cada detalhe do seu cardápio: preços, imagens e opções para todos os gostos." action={<Button disabled={!canCreate} onClick={() => { save.reset(); setEditor({ record: null }) }}><Plus />Novo produto</Button>} />
    <div className="mb-5 flex flex-wrap items-end gap-4 rounded-xl border bg-card p-4"><div className="min-w-56 flex-1 space-y-2"><Label htmlFor="search">Buscar produto</Label><div className="relative"><Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" /><Input id="search" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Digite o nome do produto" /></div></div>
      <div className="w-full space-y-2 sm:w-60"><Label htmlFor="filter-category">Categoria</Label><NativeSelect id="filter-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={categories.isPending || categories.isError}><NativeSelectOption value="">Todas as categorias</NativeSelectOption>{categories.data?.map((category) => <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>)}</NativeSelect></div></div>
    {query.isPending || categories.isPending ? <LoadingState /> : query.isError || categories.isError ? <ErrorState error={query.error || categories.error} retry={() => { void query.refetch(); void categories.refetch() }} /> : <>
      {!canCreate ? <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Cadastre ou ative uma categoria para adicionar produtos.</p> : null}
      {products.length === 0 ? <EmptyState title={search || categoryId ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'} description={search || categoryId ? 'Ajuste a busca ou selecione outra categoria.' : 'Adicione os produtos do restaurante para começar.'} /> :
        <div className="overflow-hidden rounded-xl border bg-card"><div className="border-b px-5 py-4"><h2 className="font-semibold">Produtos do cardápio <span className="ml-2 text-sm font-normal text-muted-foreground">{products.length}</span></h2></div>
          <Table><TableHeader><TableRow><TableHead className="pl-5">Produto</TableHead><TableHead>Categoria</TableHead><TableHead>Preço</TableHead><TableHead>Indicadores</TableHead><TableHead>Situação</TableHead><TableHead className="pr-5 text-right">Ações</TableHead></TableRow></TableHeader>
            <TableBody>{products.map((product) => <TableRow key={product.id}><TableCell className="pl-5"><div className="flex items-center gap-3"><ImagePreview key={product.picture} src={product.picture} alt={product.name} /><div><p className="font-medium">{product.name}</p><p className="mt-1 max-w-64 truncate text-xs text-muted-foreground">{product.description || 'Sem descrição'}</p></div></div></TableCell>
              <TableCell>{product.category?.name ?? 'Sem categoria'}</TableCell><TableCell className="font-semibold tabular-nums">{currency(product.price)}</TableCell><TableCell><div className="flex flex-wrap gap-1.5">{product.isVegetarian ? <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-800"><Leaf className="size-3" />Vegetariano</Badge> : null}{product.isNew ? <Badge variant="outline" className="gap-1 border-orange-200 bg-orange-50 text-orange-800"><Sparkles className="size-3" />Novidade</Badge> : null}{!product.isVegetarian && !product.isNew ? <span className="text-muted-foreground">—</span> : null}</div></TableCell><TableCell><ActiveBadge active={product.active} /></TableCell>
              <TableCell className="pr-4"><RowActions name={product.name} onEdit={() => { save.reset(); setEditor({ record: product }) }} onDelete={() => { remove.reset(); setDeleting(product) }} /></TableCell></TableRow>)}</TableBody></Table>
        </div>}
    </>}
    {editor ? <ProductForm key={editor.record?.id ?? 'new'} product={editor.record} categories={categories.data ?? []} pending={save.isPending} error={save.error} onClose={() => setEditor(null)} onSave={(data) => save.mutate({ id: editor.record?.id, data }, { onSuccess: () => setEditor(null) })} /> : null}
    <DeleteDialog name={deleting?.name ?? null} pending={remove.isPending} error={remove.error} onCancel={() => setDeleting(null)} onConfirm={() => { if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) }) }} />
  </>
}
