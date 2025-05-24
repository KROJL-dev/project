export const Tokens = ['access', 'refresh'] as const

export interface SignUpResponse {
  accessToken: string
  refreshToken: string
}

export const LSAuthKeys = {
  [Tokens[0]]: 'ACCESS_TOKEN',
  [Tokens[1]]: 'REFRESH_TOKEN',
} as const
