import { create } from 'zustand'

import { removeTokens, saveTokens } from '@/shared/lib/handleTokens'
import { Tokens, type SignUpResponse } from '@/shared/types'

interface AuthState {
  isAuth: boolean
  actions: {
    login: (data: SignUpResponse) => void
    logout: () => void
  }
}

const useAuthStore = create<AuthState>(set => ({
  isAuth: false,
  actions: {
    login: (data: SignUpResponse) => {
      saveTokens(data)
      set({ isAuth: true })
    },
    logout: () => {
      removeTokens(Tokens)
      set({ isAuth: false })
      window.location.pathname = '/login'
    },
  },
}))

export const useIsUserAuthorized = () => useAuthStore(state => state.isAuth)

export const useAuthActions = () => useAuthStore(state => state.actions)
export const getAuthActions = () => useAuthStore.getState().actions
