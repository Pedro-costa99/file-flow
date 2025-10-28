import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppLayout } from './layouts/AppLayout'
import { ConvertPage } from './pages/ConvertPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlansPage } from './pages/PlansPage'

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const convertRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'convert',
  component: ConvertPage,
})

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'plans',
  component: PlansPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  component: DashboardPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: LoginPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  convertRoute,
  plansRoute,
  dashboardRoute,
  loginRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
