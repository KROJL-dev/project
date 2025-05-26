import { api } from '@/shared/api/axios.config'
import type { Statuses } from '../model/type'

export const patchApplicationStatus = async (applicationId: string, status: Statuses) => {
  return await api.patch(`/applications/${applicationId}`, { status })
}
