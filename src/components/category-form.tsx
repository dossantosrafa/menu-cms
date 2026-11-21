import { useState, type FormEvent } from 'react'
import { FormShell, Field, ToggleField } from '@/components/shared/form-shell'
import { Input } from '@/components/ui/input'
import { isHttpUrl } from '@/lib/validation'
import type { Category, CategoryInput } from '@/types/api'

export function CategoryForm({ category, pending, error, onClose, onSave }: {
  category: Category | null; pending: boolean; error: unknown; onClose: () => void; onSave: (data: CategoryInput) => void
}) {
  const [active, setActive] = useState(category?.active ?? true)
  const [validation, setValidation] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name')).trim()
    const icon = String(form.get('icon')).trim()
    const displayOrder = Number(form.get('displayOrder'))
    if (!name) return setValidation('Informe o nome da categoria.')
    if (!Number.isInteger(displayOrder) || displayOrder < 0) return setValidation('A ordem deve ser um número inteiro maior ou igual a zero.')
    if (!isHttpUrl(icon)) return setValidation('Informe uma URL de ícone com http:// ou https://.')
    setValidation('')
    onSave({ name, icon: icon || null, displayOrder, active })
  }
  return <FormShell title={category ? 'Editar categoria' : 'Nova categoria'} description="Organize como os grupos aparecem no cardápio." pending={pending} error={error} validation={validation} onClose={onClose} onSubmit={submit}>
    <Field id="name" label="Nome *"><Input id="name" name="name" required maxLength={60} defaultValue={category?.name} placeholder="Nome da categoria" /></Field>
    <Field id="icon" label="URL do ícone" hint="Endereço de uma imagem. Deixe vazio para remover."><Input id="icon" name="icon" type="url" defaultValue={category?.icon ?? ''} placeholder="https://…" /></Field>
    <Field id="displayOrder" label="Ordem de exibição *" hint="Números menores aparecem primeiro."><Input id="displayOrder" name="displayOrder" type="number" required min={0} step={1} defaultValue={category?.displayOrder ?? 0} /></Field>
    <ToggleField id="active" label="Categoria ativa" description="Disponível para vincular a novos produtos." checked={active} onChange={setActive} />
  </FormShell>
}
