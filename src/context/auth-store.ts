import { createContext } from 'react'
import type { PlanId } from '../data/plans'

export type AuthUser = {
  id: string
  name: string
  email: string
  plan: PlanId
  avatarColor: string
}

export type AuthContextValue = {
  user: AuthUser | null
  login: (plan: PlanId) => void
  logout: () => void
  switchPlan: (plan: PlanId) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const MOCK_USERS: Record<PlanId, AuthUser> = {
  free: {
    id: 'guest',
    name: 'Visitante FileFlow',
    email: 'guest@fileflow.dev',
    plan: 'free',
    avatarColor: '#94a3b8',
  },
  light: {
    id: 'light-user',
    name: 'Alex Light',
    email: 'alex.light@fileflow.dev',
    plan: 'light',
    avatarColor: '#60a5fa',
  },
  basic: {
    id: 'basic-user',
    name: 'Jordan Basic',
    email: 'jordan.basic@fileflow.dev',
    plan: 'basic',
    avatarColor: '#f59e0b',
  },
  unlimited: {
    id: 'unlimited-user',
    name: 'Sky Unlimited',
    email: 'sky.unlimited@fileflow.dev',
    plan: 'unlimited',
    avatarColor: '#34d399',
  },
}
