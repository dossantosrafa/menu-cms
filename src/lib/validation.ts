export function isHttpUrl(value: string) {
  if (!value) return true
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

export function parsePrice(value: string): number | null {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null
  const price = Number(normalized)
  return Number.isFinite(price) && price > 0 && price <= 99_999_999.99 ? price : null
}
