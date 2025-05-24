import { useMutation } from '@tanstack/react-query'

import { api } from '@/shared/api/axios.config'
import type { SignUpResponse } from '@/shared/types'

import { toast } from 'sonner'

import NotificationTimer from '../ui/notificationTimer'

import { getAuthActions } from '../model/auth'

interface SignUpRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>('auth/register', data)
  return response.data
}

const onSuccess = (data: SignUpResponse) => {
  if (data) {
    console.log('data')
    const { login } = getAuthActions()
    login(data)
    window.location.pathname = '/dashboard'
  }
  toast.success("You're in! Welcome to the team 🎉", {
    description: (
      <NotificationTimer label="Registration successful! U will be redirected through " timer={3} />
    ),
  })
}

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess,
    onError: () =>
      toast('Registration failed', {
        description: 'Please try again later.',
        action: {
          label: 'Retry',
          onClick: () => console.log('Retry'),
        },
      }),
  })
}
