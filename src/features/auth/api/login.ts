import { useMutation } from '@tanstack/react-query'

import { api } from '@/shared/api/axios.config'
import type { SignUpResponse } from '@/shared/types'

import { toast } from 'sonner'

import { getAuthActions } from '../model/auth'
import { redirect } from '@tanstack/react-router'

interface LoginRequest {
  email: string
  password: string
}

const signIn = async (data: LoginRequest): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>('auth/login', data)
  return response.data
}

const onSuccess = (data: SignUpResponse) => {
  if (data) {
    const { login } = getAuthActions()

    login(data)
    redirect({ to: '/dashboard' })
  }
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: signIn,
    onSuccess,
    onError: () => {
      toast('Registration failed', {
        description: 'Please try again later.',
        action: {
          label: 'Retry',
          onClick: () => console.log('Retry'),
        },
      })
    },
  })
}
