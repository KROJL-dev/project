import { create } from 'zustand'

import { removeTokens, saveTokens } from '@/shared/lib/handleTokens'
import { Tokens, type SignUpResponse } from '@/shared/types'

interface AuthState {
  isAuth: boolean
  isAuthChecked: boolean
  actions: {
    login: (data: SignUpResponse) => void
    logout: (isNeedRedirect?: boolean) => void
    setIsAuthChecked: (isAuthChecked: boolean) => void
  }
}

const useAuthStore = create<AuthState>(set => ({
  isAuth: false,
  isAuthChecked: false,

  actions: {
    setIsAuthChecked: (isAuthChecked: boolean) => set({ isAuthChecked }),
    login: (data: SignUpResponse) => {
      saveTokens(data)
      set({ isAuth: true })
    },
    logout: (isNeedRedirect = true) => {
      removeTokens(Tokens)
      set({ isAuth: false })
      if (isNeedRedirect) window.location.pathname = '/login'
    },
  },
}))

export const useIsUserAuthorized = () => useAuthStore(state => state.isAuth)
export const useIsAuthChecked = () => useAuthStore(state => state.isAuthChecked)
export const useAuthActions = () => useAuthStore(state => state.actions)
export const getAuthActions = () => useAuthStore.getState().actions
