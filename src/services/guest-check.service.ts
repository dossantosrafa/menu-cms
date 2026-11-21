import { api } from '@/lib/axios'
import type { GuestCheck } from '@/types/api'

export const guestCheckService = {
  listOpened: async () => (await api.get<GuestCheck[]>('/guest-checks', { params: { status: 'OPENED' } })).data,
  findOne: async (id: string) => (await api.get<GuestCheck>(`/guest-checks/${id}`)).data,
}
