import { useState } from 'react'
import { Button } from '../components/Button'
import { PLANS, getPlanById } from '../data/plans'
import { useAuth } from '../hooks/use-auth'
import type { Plan, PlanId } from '../data/plans'
import { useNavigate } from '@tanstack/react-router'

export function PlansPage() {
  const [billingMode, setBillingMode] = useState<'monthly' | 'annual'>('monthly')
  const { user, login, switchPlan } = useAuth()
  const navigate = useNavigate()

  const multiplyPrice = billingMode === 'annual' ? 0.85 : 1

  const handleSelect = (plan: PlanId) => {
    if (!user) {
      login(plan)
    } else {
      switchPlan(plan)
    }
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold text-white">Planos que evoluem com o seu fluxo</h2>
        <p className="text-sm text-slate-300">
          Comece grátis, simule upgrades instantâneos e veja como os limites mudam no dashboard.
        </p>
      </header>

      <div className="mx-auto flex items-center gap-4 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-2 text-xs font-semibold text-slate-400">
        <button
          className={`rounded-full px-4 py-2 transition ${
            billingMode === 'monthly'
              ? 'bg-slate-100 text-slate-900 shadow shadow-cyan-500/10'
              : 'hover:text-white'
          }`}
          onClick={() => setBillingMode('monthly')}
        >
          Mensal
        </button>
        <button
          className={`rounded-full px-4 py-2 transition ${
            billingMode === 'annual'
              ? 'bg-slate-100 text-slate-900 shadow shadow-cyan-500/10'
              : 'hover:text-white'
          }`}
          onClick={() => setBillingMode('annual')}
        >
          Anual (-15%)
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingMultiplier={multiplyPrice}
            active={user?.plan === plan.id}
            onSelect={() => handleSelect(plan.id)}
          />
        ))}
      </div>
    </div>
  )
}

type PlanCardProps = {
  plan: Plan
  billingMultiplier: number
  active: boolean
  onSelect: () => void
}

function PlanCard({ plan, billingMultiplier, active, onSelect }: PlanCardProps) {
  const priceValue = Number(plan.price.replace('$', ''))
  const finalPrice =
    billingMultiplier === 1 ? plan.price : `$${(priceValue * billingMultiplier).toFixed(2)}`

  return (
    <article
      className={`relative flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition ${
        plan.highlight
          ? 'shadow-lg shadow-cyan-500/10'
          : 'hover:border-cyan-400/60 hover:shadow-md hover:shadow-cyan-500/5'
      } ${active ? 'border-cyan-400/60' : ''}`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 right-6 inline-flex rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">
          {plan.highlight}
        </span>
      )}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
        <p className="text-sm text-slate-400">{plan.description}</p>
      </div>
      <div className="text-3xl font-bold text-white">
        {finalPrice}
        {billingMultiplier !== 1 && <span className="ml-2 text-sm text-emerald-300">economia 15%</span>}
      </div>
      <ul className="space-y-2 text-sm text-slate-300">
        {plan.perks.map((perk) => (
          <li key={perk}>- {perk}</li>
        ))}
      </ul>
      <Button onClick={onSelect} className="mt-auto">
        {active ? 'Plano atual' : 'Continuar'}
      </Button>
    </article>
  )
}

export function CurrentPlanBadge({ planId }: { planId: PlanId }) {
  const plan = getPlanById(planId)
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200">
      {plan.name}
    </div>
  )
}


