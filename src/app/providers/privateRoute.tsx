import { useAuthActions, useIsAuthChecked, useIsUserAuthorized } from '@/features/auth/model/auth'
import { useNavigate } from '@tanstack/react-router'

import { type PropsWithChildren, type FC, useEffect } from 'react'

import Layout from '@/app/layout'

const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()
  const isUserAuthorized = useIsUserAuthorized()
  const isAuthChecked = useIsAuthChecked()
  const { logout } = useAuthActions()

  useEffect(() => {
    if (isAuthChecked) {
      if (!isUserAuthorized) {
        logout()

        navigate({ to: '/login' })
      }
    }
  }, [isAuthChecked, isUserAuthorized])

  return <Layout>{children}</Layout>
}
export default PrivateRoute
