import { api } from '@/shared/api/axios.config'
import type { Application, Meeting } from '../model/type'

export const postMeeting = async (applicationId: Application['id'], meeting: Meeting) => {
  return await api.post(`/applications/${applicationId}/meeting`, meeting)
}
