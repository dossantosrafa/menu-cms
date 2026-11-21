import { useState, type FormEvent } from 'react'
import { FormShell, Field, ToggleField } from '@/components/shared/form-shell'
import { Input } from '@/components/ui/input'
import type { Spot, SpotInput } from '@/types/api'

export function SpotForm({ spot, pending, error, onClose, onSave }: {
  spot: Spot | null; pending: boolean; error: unknown; onClose: () => void; onSave: (data: SpotInput) => void
}) {
  const [active, setActive] = useState(spot?.active ?? true)
  const [validation, setValidation] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = String(new FormData(event.currentTarget).get('name')).trim()
    if (!name) return setValidation('Informe o nome da mesa.')
    setValidation(''); onSave({ name, active })
  }
  return <FormShell title={spot ? 'Editar mesa' : 'Nova mesa'} description="Cadastre os locais de atendimento do restaurante." pending={pending} error={error} validation={validation} onClose={onClose} onSubmit={submit}>
    <Field id="name" label="Nome da mesa *"><Input id="name" name="name" required maxLength={60} defaultValue={spot?.name} placeholder="Identificação da mesa" /></Field>
    <ToggleField id="active" label="Mesa ativa" description="Permite receber novos pedidos." checked={active} onChange={setActive} />
  </FormShell>
}
