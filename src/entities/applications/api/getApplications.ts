import { api } from '@/shared/api/axios.config'

export const getApplications = async () => {
  const response = await api.get('/applications')
  return response.data
}
