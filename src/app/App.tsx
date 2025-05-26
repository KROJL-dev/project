import { Outlet } from '@tanstack/react-router'

import { Toaster } from '@/shared/ui/sonner'
import { useAuthActions } from '@/features/auth/model/auth'
import { useEffect, type FC, type PropsWithChildren } from 'react'
import { LSAuthKeys, Tokens } from '@/shared/types'

const App: FC<PropsWithChildren> = () => {
  const { login } = useAuthActions()

  useEffect(() => {
    const [accessToken, refreshToken] = Tokens.map(key =>
      window.localStorage.getItem(LSAuthKeys[key])
    )

    if (
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken &&
      refreshToken !== 'undefined'
    ) {
      login({ accessToken, refreshToken })
    }
  }, [])

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}
export default App
