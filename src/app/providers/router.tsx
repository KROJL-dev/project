import { lazy } from 'react'

import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from '../App'

import PrivateRoute from './privateRoute'
const LoginPage = lazy(() => import('@/pages/login/ui/LoginPage'))
const SignUpPage = lazy(() => import('@/pages/signUp/ui/SignUpPage'))
const ApplicationsPage = lazy(() => import('@/pages/applications/ui/index'))
const DashboardPage = lazy(() => import('@/pages/dashboard/ui/DashboardPage'))

const rootRoute = createRootRoute({
  component: App,
})

const loginRoute = createRoute({
  path: '/login',
  getParentRoute: () => rootRoute,
  component: LoginPage,
})

const dashboardRoute = createRoute({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
  component: () => (
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  ),
})

const applicationsRoute = createRoute({
  path: '/applications',
  getParentRoute: () => rootRoute,
  component: () => (
    <PrivateRoute>
      <ApplicationsPage />
    </PrivateRoute>
  ),
})

const signUpRoute = createRoute({
  path: '/signUp',
  getParentRoute: () => rootRoute,
  component: SignUpPage,
})
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  applicationsRoute,
  loginRoute,
  signUpRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
