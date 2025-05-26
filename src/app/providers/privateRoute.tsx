import { useAuthActions, useIsUserAuthorized } from '@/features/auth/model/auth'

import { type PropsWithChildren, type FC, useEffect } from 'react'

import Layout from '@/app/layout'

const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const isUserAuthorized = useIsUserAuthorized()

  const { logout } = useAuthActions()

  useEffect(() => {
    if (!isUserAuthorized) {
      logout()
      window.location.pathname = '/login'
    }
  }, [])
  return <Layout>{children}</Layout>
}
export default PrivateRoute
