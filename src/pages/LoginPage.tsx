import { Button } from '../components/Button'
import { PLANS } from '../data/plans'
import { useAuth } from '../hooks/use-auth'
import type { PlanId } from '../data/plans'
import { useNavigate } from '@tanstack/react-router'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (plan: PlanId) => {
    login(plan)
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 px-8 py-12 text-center">
      <header className="space-y-4">
        <h2 className="text-3xl font-semibold text-white">Simular login com Google</h2>
        <p className="text-sm text-slate-300">
          Enquanto integramos o OAuth real, escolha um plano para testar a experiência completa no
          dashboard e na tela de conversões.
        </p>
      </header>

      <div className="grid gap-4">
        <Button onClick={() => handleLogin('free')} variant="secondary" className="justify-center py-3">
          Entrar como convidado (plano gratuito)
        </Button>
        {PLANS.filter((plan) => plan.id !== 'free').map((plan) => (
          <button
            key={plan.id}
            onClick={() => handleLogin(plan.id)}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-4 text-left text-sm text-slate-200 transition hover:border-cyan-400 hover:shadow hover:shadow-cyan-500/10"
          >
            <div>
              <p className="text-base font-semibold text-white">Continuar com Google ({plan.name})</p>
              <p className="text-xs text-slate-400">{plan.description}</p>
            </div>
            <span className="text-sm font-semibold text-cyan-300">{plan.price}/mes</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        A autenticação real via Google será conectada em breve. Este fluxo é apenas uma simulação para o
        MVP do FileFlow.
      </p>
    </div>
  )
}

