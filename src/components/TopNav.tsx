import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useAuth } from '../hooks/use-auth'
import { Avatar } from './avatar'
import { Button } from './Button'

export function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 text-slate-950 font-bold">
              FF
            </span>
            <span>FileFlow</span>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <Link
              to="/"
              className="transition-colors text-slate-300 hover:text-white"
              activeProps={{ className: 'text-white' }}
              activeOptions={{ exact: true }}
            >
              Início
            </Link>
            <Link
              to="/convert"
              className="transition-colors text-slate-300 hover:text-white"
              activeProps={{ className: 'text-white' }}
            >
              Conversor
            </Link>
            <Link
              to="/plans"
              className="transition-colors text-slate-300 hover:text-white"
              activeProps={{ className: 'text-white' }}
            >
              Planos
            </Link>
            <Link
              to="/dashboard"
              className="transition-colors text-slate-300 hover:text-white"
              activeProps={{ className: 'text-white' }}
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right text-sm font-medium text-slate-200 sm:block">
                <p>{user.name}</p>
                <p className="text-xs text-slate-400">{user.plan.toUpperCase()}</p>
              </div>
              <Avatar name={user.name} color={user.avatarColor} />
              <Button
                variant="ghost"
                onClick={() => {
                  logout()
                  if (pathname.startsWith('/dashboard')) {
                    navigate({ to: '/' })
                  }
                }}
                className="hidden text-sm font-semibold sm:inline-flex"
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>
                Login
              </Button>
              <Button onClick={() => navigate({ to: '/plans' })} className="hidden sm:inline-flex">
                Começar grátis
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

