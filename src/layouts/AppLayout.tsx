import type { PropsWithChildren, ReactNode } from 'react'
import { Footer } from '../components/Footer'
import { TopNav } from '../components/TopNav'

export function AppLayout({ children }: PropsWithChildren): ReactNode {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <TopNav />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

