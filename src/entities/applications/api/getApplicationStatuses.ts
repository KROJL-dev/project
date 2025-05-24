import { api } from '@/shared/api/axios.config'

export const getApplicationStatuses = async () => {
  const response = await api.get('/applications/statuses')
  return response.data
}
