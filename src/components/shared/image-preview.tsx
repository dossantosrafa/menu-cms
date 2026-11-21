import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export function ImagePreview({ src, alt }: { src?: string | null; alt: string }) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? <img src={src} alt={alt} loading="lazy" className="size-12 rounded-lg border bg-muted object-cover" onError={() => setFailed(true)} />
    : <div className="flex size-12 items-center justify-center rounded-lg border bg-muted" role="img" aria-label={`${alt}: sem imagem`}><ImageOff className="size-5 text-muted-foreground" /></div>
}
