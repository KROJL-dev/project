import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()

export const withReactQuery = (children: ReactNode) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
