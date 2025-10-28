import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/use-auth'
import { Avatar } from './avatar'
import { Button } from './Button'

type NavLinkDefinition = {
  to: string
  label: string
  exact?: boolean
}

const MOBILE_MENU_BASE =
  'md:hidden overflow-hidden transition-all duration-200 border-t border-slate-800 bg-slate-950/95 backdrop-blur'

export function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinks = useMemo<NavLinkDefinition[]>(
    () => [
      { to: '/', label: 'Início', exact: true },
      { to: '/convert', label: 'Conversor' },
      { to: '/plans', label: 'Planos' },
      { to: '/dashboard', label: 'Dashboard' },
    ],
    [],
  )

  const renderLink = (link: NavLinkDefinition, className?: string) => {
    const baseClasses = ['transition-colors text-slate-300 hover:text-white', className]
      .filter(Boolean)
      .join(' ')

    return (
      <Link
        key={link.to}
        to={link.to}
        activeOptions={link.exact ? { exact: true } : undefined}
        activeProps={{ className: 'text-white' }}
        className={baseClasses}
      >
        {link.label}
      </Link>
    )
  }

  const handleLogout = () => {
    logout()
    if (pathname.startsWith('/dashboard')) {
      navigate({ to: '/' })
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 md:gap-10">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-cyan-400 hover:text-white md:hidden"
            aria-label="Abrir menu de navegação"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 text-slate-950 font-bold">
              FF
            </span>
            <span>FileFlow</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => renderLink(link, 'text-sm font-medium'))}
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
                onClick={handleLogout}
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

      <div
        className={[
          MOBILE_MENU_BASE,
          menuOpen ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="flex flex-col gap-2 px-6 py-4">
          {navLinks.map((link) =>
            renderLink(link, 'block rounded-lg px-3 py-2 text-sm font-medium'),
          )}
        </div>

        <div className="border-t border-slate-800 px-6 py-4">
          {user ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} color={user.avatarColor} />
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.plan.toUpperCase()}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-sm font-semibold">
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>
                Login
              </Button>
              <Button onClick={() => navigate({ to: '/plans' })}>Começar grátis</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
