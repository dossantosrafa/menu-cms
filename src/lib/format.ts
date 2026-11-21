export const currency = (value: number | string) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
}).format(Number(value))

export const dateTime = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short', timeStyle: 'short',
}).format(new Date(value))

export const time = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit', minute: '2-digit',
}).format(new Date(value))

export const shortId = (id: string) => id.slice(0, 8).toUpperCase()
