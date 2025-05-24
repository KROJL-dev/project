import { api } from '@/shared/api/axios.config'

export const patchApplicationOrder = async (applicationId: string, order: number) => {
  return await api.patch(`/applications/${applicationId}`, { order })
}
