import { api } from '@/lib/axios'
import type { Spot, SpotInput } from '@/types/api'

export const spotService = {
  list: async () => (await api.get<Spot[]>('/spots')).data,
  create: async (input: SpotInput) => (await api.post<Spot>('/spots', input)).data,
  update: async (id: string, input: SpotInput) => (await api.patch<Spot>(`/spots/${id}`, input)).data,
  remove: async (id: string) => { await api.delete(`/spots/${id}`) },
}
