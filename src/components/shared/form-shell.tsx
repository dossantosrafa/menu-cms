import type { ReactNode, FormEventHandler } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getErrorMessage } from '@/lib/axios'

export function FormShell({ title, description, pending, error, validation, onClose, onSubmit, children }: {
  title: string; description: string; pending: boolean; error: unknown; validation: string;
  onClose: () => void; onSubmit: FormEventHandler<HTMLFormElement>; children: ReactNode
}) {
  return <Dialog open onOpenChange={(open) => { if (!open && !pending) onClose() }}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl" showCloseButton={!pending}>
      <DialogHeader><DialogTitle className="text-xl font-semibold">{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-5">
        <fieldset disabled={pending} className="space-y-5">{children}</fieldset>
        {validation || error ? <Alert variant="destructive"><AlertDescription>{validation || getErrorMessage(error)}</AlertDescription></Alert> : null}
        <DialogFooter><Button type="button" variant="outline" disabled={pending} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={pending}>{pending ? 'Salvando…' : 'Salvar'}</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
}

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}{hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}</div>
}

export function ToggleField({ id, label, description, checked, onChange }: { id: string; label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><Label htmlFor={id}>{label}</Label><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><Switch id={id} checked={checked} onCheckedChange={onChange} /></div>
}
