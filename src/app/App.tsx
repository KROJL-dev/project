import { Outlet, useNavigate, useLocation } from '@tanstack/react-router'

import { Toaster } from '@/shared/ui/atoms/sonner'
import { useAuthActions } from '@/features/auth/model/auth'
import { useEffect, type FC, type PropsWithChildren } from 'react'
import { LSAuthKeys, Tokens } from '@/shared/types'

const App: FC<PropsWithChildren> = () => {
  const { login, setIsAuthChecked, logout } = useAuthActions()

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const [accessToken, refreshToken, expiresIn] = Tokens.map(key =>
      window.localStorage.getItem(LSAuthKeys[key])
    )

    console.log('here')
    if (
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken &&
      refreshToken !== 'undefined'
    ) {
      login({ accessToken, refreshToken, expiresIn: Number(expiresIn) })
      if (location.pathname === '/') navigate({ to: '/dashboard' })
      setIsAuthChecked(true)
    } else {
      logout(false)
      navigate({ to: '/login' })
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
