import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/axios'

export function DeleteDialog({ name, pending, error, onCancel, onConfirm }: {
  name: string | null; pending: boolean; error: unknown; onCancel: () => void; onConfirm: () => void
}) {
  return <AlertDialog open={name !== null} onOpenChange={(open) => { if (!open && !pending) onCancel() }}>
    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir este registro?</AlertDialogTitle>
      <AlertDialogDescription>O registro “{name}” será removido. Esta ação não pode ser desfeita. Registros vinculados à operação podem precisar ser desativados.</AlertDialogDescription></AlertDialogHeader>
      {error ? <p role="alert" className="text-sm text-destructive">{getErrorMessage(error)}</p> : null}
      <AlertDialogFooter><Button variant="outline" disabled={pending} onClick={onCancel}>Cancelar</Button>
        <Button variant="destructive" disabled={pending} onClick={onConfirm}>{pending ? 'Excluindo…' : 'Confirmar exclusão'}</Button></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}
