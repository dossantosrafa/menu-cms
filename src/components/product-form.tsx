import { useState, type FormEvent } from 'react'
import { FormShell, Field, ToggleField } from '@/components/shared/form-shell'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { isHttpUrl, parsePrice } from '@/lib/validation'
import type { Category, Product, ProductInput } from '@/types/api'

export function ProductForm({ product, categories, pending, error, onClose, onSave }: {
  product: Product | null; categories: Category[]; pending: boolean; error: unknown; onClose: () => void; onSave: (data: ProductInput) => void
}) {
  const [active, setActive] = useState(product?.active ?? true)
  const [isVegetarian, setVegetarian] = useState(product?.isVegetarian ?? false)
  const [isNew, setNew] = useState(product?.isNew ?? false)
  const [validation, setValidation] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const categoryId = String(form.get('categoryId') ?? '')
    const price = parsePrice(String(form.get('price')))
    const picture = String(form.get('picture')).trim()
    if (!name) return setValidation('Informe o nome do produto.')
    if (!categoryId || !categories.some((category) => category.id === categoryId)) return setValidation('Selecione uma categoria cadastrada.')
    if (price === null) return setValidation('Informe um preço maior que zero, com no máximo duas casas decimais.')
    if (!isHttpUrl(picture)) return setValidation('Informe uma URL de imagem com http:// ou https://.')
    setValidation('')
    onSave({ name, description: String(form.get('description')).trim(), price, picture: picture || null, categoryId, active, isVegetarian, isNew })
  }
  return <FormShell title={product ? 'Editar produto' : 'Novo produto'} description="Preencha as informações que serão exibidas no cardápio." pending={pending} error={error} validation={validation} onClose={onClose} onSubmit={submit}>
    <Field id="name" label="Nome *"><Input id="name" name="name" required maxLength={60} defaultValue={product?.name} placeholder="Nome do produto" /></Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id="categoryId" label="Categoria *"><NativeSelect id="categoryId" name="categoryId" required defaultValue={product?.category?.id ?? ''} className="w-full"><NativeSelectOption value="" disabled>Selecione a categoria</NativeSelectOption>
        {categories.map((category) => <NativeSelectOption key={category.id} value={category.id} disabled={!category.active && category.id !== product?.category?.id}>{category.name}{!category.active ? ' (inativa)' : ''}</NativeSelectOption>)}</NativeSelect></Field>
      <Field id="price" label="Preço (R$) *"><Input id="price" name="price" required inputMode="decimal" defaultValue={product ? String(product.price).replace('.', ',') : ''} placeholder="0,00" /></Field>
    </div>
    <Field id="description" label="Descrição"><Textarea id="description" name="description" rows={3} defaultValue={product?.description ?? ''} placeholder="Ingredientes e detalhes do produto" /></Field>
    <Field id="picture" label="URL da imagem" hint="Deixe vazio para remover a imagem."><Input id="picture" name="picture" type="url" defaultValue={product?.picture ?? ''} placeholder="https://…" /></Field>
    <div className="space-y-3"><ToggleField id="active" label="Produto ativo" description="Exibido no cardápio do cliente." checked={active} onChange={setActive} />
      <ToggleField id="isVegetarian" label="Vegetariano" description="Identifica as opções vegetarianas." checked={isVegetarian} onChange={setVegetarian} />
      <ToggleField id="isNew" label="Novidade" description="Destaca um novo item no cardápio." checked={isNew} onChange={setNew} /></div>
  </FormShell>
}
