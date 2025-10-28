import { useMemo } from 'react'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/use-auth'
import { useConversions } from '../hooks/use-conversions'
import type { PlanId } from '../data/plans'
import { CurrentPlanBadge } from './PlansPage'
import { formatDateTime, formatFileSize } from '../utils/format'
import { Link } from '@tanstack/react-router'

export function DashboardPage() {
  const { user, switchPlan } = useAuth()
  const { conversions } = useConversions()

  const recentConversions = useMemo(() => conversions.slice(0, 6), [conversions])

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 px-10 py-20 text-center">
        <h2 className="text-3xl font-semibold text-white">Faça login para acessar o dashboard</h2>
        <p className="max-w-xl text-sm text-slate-300">
          O painel mostra histórico, plano ativo e limites dinâmicos. Clique abaixo para simular um login
          via Google até integrarmos o fluxo real.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-cyan-400 hover:to-emerald-400"
        >
          Simular login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Olá, {user.name}</h2>
            <p className="text-sm text-slate-300">Este é um preview do dashboard do FileFlow.</p>
          </div>
          <CurrentPlanBadge planId={user.plan} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardStat label="Conversões concluídas" value={conversions.filter((item) => item.status === 'completed').length.toString()} />
          <DashboardStat label="Arquivos ativos" value={conversions.filter((item) => item.status === 'processing').length.toString()} />
          <DashboardStat
            label="Última atividade"
            value={
              conversions[0]
                ? formatDateTime(conversions[0].createdAt)
                : 'Aguardando primeira conversão'
            }
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <aside className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Limites do plano</h3>
          <p className="text-sm text-slate-300">
            Esses valores são mockados e serão sincronizados com Supabase na integração real.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>- Tamanho máximo: {formatLimit(user.plan)}</li>
            <li>- Conversões simultâneas: {formatConcurrent(user.plan)}</li>
            <li>- Prioridade: {priorityLabel(user.plan)}</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-4">
            <Button variant="secondary" onClick={() => switchPlan('light')}>
              Testar plano Light
            </Button>
            <Button variant="secondary" onClick={() => switchPlan('basic')}>
              Testar plano Basic
            </Button>
            <Button variant="secondary" onClick={() => switchPlan('unlimited')}>
              Plano Unlimited
            </Button>
          </div>
        </aside>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <header className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Histórico de conversões</h3>
            <Link
              to="/convert"
              className="text-xs font-semibold uppercase tracking-widest text-cyan-200 hover:text-cyan-100"
            >
              Nova conversão
            </Link>
          </header>
          <div className="mt-6 space-y-4">
            {recentConversions.map((conversion) => (
              <article
                key={conversion.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{conversion.fileName}</p>
                  <p className="text-xs text-slate-400">
                    {conversion.sourceFormat.toUpperCase()} {'->'} {conversion.targetFormat.toUpperCase()} -{' '}
                    {formatFileSize(conversion.sizeMB)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                    conversion.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {conversion.status}
                </span>
              </div>
              {conversion.status === 'completed' && conversion.downloadUrl && (
                <div className="mt-3">
                  <a
                    href={conversion.downloadUrl}
                    download={conversion.downloadFileName ?? conversion.fileName}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Baixar arquivo convertido
                  </a>
                </div>
              )}
              <div className="mt-3 text-xs text-slate-400">
                Iniciado em {formatDateTime(conversion.createdAt)}
                {conversion.completedAt && (
                  <span> - Concluído em {formatDateTime(conversion.completedAt)}</span>
                )}
                </div>
              </article>
            ))}
            {recentConversions.length === 0 && (
              <p className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center text-sm text-slate-400">
                Você ainda não realizou conversões. Envie seu primeiro arquivo na aba Conversor.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function formatLimit(planId: PlanId) {
  if (planId === 'free') return '100 MB'
  if (planId === 'light') return '500 MB'
  if (planId === 'basic') return '1 GB'
  return 'Ilimitado'
}

function formatConcurrent(planId: PlanId) {
  if (planId === 'free') return '5 tarefas'
  if (planId === 'light') return '25 tarefas'
  if (planId === 'basic') return '50 tarefas'
  return 'Sem limites'
}

function priorityLabel(planId: PlanId) {
  if (planId === 'free') return 'Fila pública'
  if (planId === 'light') return 'Alta prioridade'
  if (planId === 'basic') return 'Prioridade maior'
  return 'Prioridade máxima'
}





