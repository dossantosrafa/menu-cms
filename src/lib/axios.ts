import axios from 'axios'

export const apiUrl = import.meta.env.VITE_API_URL?.trim()

// Esta é a única instância HTTP da aplicação. A URL vem exclusivamente do .env.
export const api = axios.create({
  baseURL: apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (!apiUrl) {
    throw new Error('Configure VITE_API_URL no arquivo .env e reinicie o CMS.')
  }
  return config
})

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message
    if (Array.isArray(message)) return message.join(' · ')
    if (typeof message === 'string') return message
    if (error.code === 'ECONNABORTED') return 'A API demorou para responder. Tente novamente.'
    if (!error.response) return 'Não foi possível acessar a API. Confira se o backend está rodando e se VITE_API_URL está correta.'
    return 'Não foi possível concluir a operação. Tente novamente.'
  }
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
}
