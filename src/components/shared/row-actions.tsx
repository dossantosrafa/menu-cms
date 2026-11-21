import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RowActions({ name, onEdit, onDelete }: { name: string; onEdit: () => void; onDelete: () => void }) {
  return <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" aria-label={`Editar ${name}`} onClick={onEdit}><Pencil /></Button>
    <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-50 hover:text-destructive" aria-label={`Excluir ${name}`} onClick={onDelete}><Trash2 /></Button></div>
}
