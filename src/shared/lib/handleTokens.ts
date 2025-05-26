import { api } from '@/shared/api/axios.config'
import { LSAuthKeys, type SignUpResponse, type Tokens } from '@/shared/types'

export const saveTokens = (tokens: SignUpResponse) => {
  if ('accessToken' in tokens) {
    api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`

    window.localStorage.setItem(LSAuthKeys.access, tokens.accessToken)
  }
  if ('refreshToken' in tokens) {
    window.localStorage.setItem(LSAuthKeys.refresh, tokens.refreshToken)
  }
}

export const removeTokens = (tokens: typeof Tokens) => {
  tokens.forEach(tokenType => window.localStorage.removeItem(LSAuthKeys[tokenType]))
}
