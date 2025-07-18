export const Tokens = ['access', 'refresh', 'expiresIn'] as const

export interface SignUpResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export const LSAuthKeys = {
  [Tokens[0]]: 'ACCESS_TOKEN',
  [Tokens[1]]: 'REFRESH_TOKEN',
  expiresIn: 'EXPIRES_IN',
} as const
