import { useQuery } from '@tanstack/react-query'
import { ApplicationQueryKeys } from '@/entities/applications/model'
import { getApplicationStatuses } from '../../api'

export const useApplicationStatusesQuery = () => {
  return useQuery<string[]>({
    queryKey: [ApplicationQueryKeys.statuses],
    queryFn: getApplicationStatuses,
    initialData: [],
  })
}
