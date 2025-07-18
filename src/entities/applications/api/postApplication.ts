import { api } from '@/shared/api/axios.config'
import type { Application } from '../model/type'

export const postApplication = async (
  application: Omit<Application, 'id' | 'order' | 'createdAt'>
) => {
  return await api.post('/applications', application)
}
