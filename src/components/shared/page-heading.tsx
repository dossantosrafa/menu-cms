import type { ReactNode } from 'react'

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
    <div><h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground">{description}</p></div>
    {action}
  </div>
}
