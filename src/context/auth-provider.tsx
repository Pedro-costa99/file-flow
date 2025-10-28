'use client'

import { useMemo, useState } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import type { PlanId } from '../data/plans'
import { AuthContext, MOCK_USERS, type AuthContextValue, type AuthUser } from './auth-store'

export function AuthProvider({ children }: PropsWithChildren): ReactNode {
  const [user, setUser] = useState<AuthUser | null>(null)

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      login: (plan: PlanId) => {
        setUser(MOCK_USERS[plan])
      },
      logout: () => setUser(null),
      switchPlan: (plan: PlanId) => {
        setUser((current) => {
          if (!current) return MOCK_USERS[plan]
          return { ...current, plan }
        })
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
