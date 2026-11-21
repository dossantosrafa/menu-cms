import { describe, expect, it } from 'vitest'
import { parsePrice, isHttpUrl } from '../src/lib/validation'
import { isOrderStatus, totalForCheck } from '../src/lib/orders'
import type { Order } from '../src/types/api'

describe('preço informado no formulário', () => {
  it('aceita centavos com vírgula ou ponto e rejeita preço zero, negativo ou ambíguo', () => {
    expect(parsePrice('19,90')).toBe(19.9)
    expect(parsePrice('20.15')).toBe(20.15)
    for (const value of ['0', '-5', '1.001', '1.234,56', '', 'Infinity', 'R$ 10', '100000000']) expect(parsePrice(value)).toBeNull()
  })
})

describe('URLs de imagens', () => {
  it('permite remover a imagem e aceita apenas HTTP(S)', () => {
    expect(isHttpUrl('')).toBe(true)
    expect(isHttpUrl('https://example.com/imagem.png')).toBe(true)
    for (const value of ['javascript:alert(1)', 'ftp://example.com', 'imagem.png']) expect(isHttpUrl(value)).toBe(false)
  })
})

describe('total acumulado da comanda', () => {
  it('soma valores numeric recebidos como string em centavos e isola a comanda', () => {
    const orders = [
      { total: '0.10', guestCheck: { id: 'a' } },
      { total: '0.20', guestCheck: { id: 'a' } },
      { total: '100.00', guestCheck: { id: 'b' } },
    ] as Order[]
    expect(totalForCheck(orders, 'a')).toBe(0.3)
    expect(totalForCheck(orders, 'b')).toBe(100)
    expect(totalForCheck(orders, 'c')).toBe(0)
  })
})

describe('contrato de status', () => {
  it('aceita os quatro valores previstos e rejeita o nome legado', () => {
    for (const status of ['NEW', 'PREPARING', 'READY', 'DELIVERED']) expect(isOrderStatus(status)).toBe(true)
    expect(isOrderStatus('DELIVERY')).toBe(false)
    expect(isOrderStatus('')).toBe(false)
  })
})
