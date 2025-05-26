import { useQuery } from '@tanstack/react-query'
import { ApplicationQueryKeys } from '@/entities/applications/model'
import { getApplications } from '../../api/getApplications'

export const useApplicationsQuery = () => {
  return useQuery({
    queryKey: [ApplicationQueryKeys.applications],
    queryFn: getApplications,
    initialData: [],
  })
}
