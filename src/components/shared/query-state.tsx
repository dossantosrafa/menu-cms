import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/axios'

export function LoadingState({ label = 'Carregando dados…' }: { label?: string }) {
  return <div role="status" className="rounded-xl border bg-card p-7"><p className="mb-6 flex items-center gap-2 text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />{label}</p>
    <div className="space-y-4">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-12 w-full" />)}</div></div>
}

export function ErrorState({ error, retry }: { error: unknown; retry: () => void }) {
  return <Alert variant="destructive" className="bg-card"><AlertCircle /><AlertTitle>Não foi possível carregar os dados</AlertTitle>
    <AlertDescription><p>{getErrorMessage(error)}</p><Button variant="outline" className="mt-3" onClick={retry}>Tentar novamente</Button></AlertDescription></Alert>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center">
    <div className="mb-4 rounded-2xl bg-muted p-4"><Inbox className="size-6 text-muted-foreground" /></div>
    <h2 className="font-semibold">{title}</h2><p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p></div>
}
