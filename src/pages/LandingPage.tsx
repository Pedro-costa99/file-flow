import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/use-auth'

const FEATURE_CARDS = [
  {
    title: 'Mais de 40 formatos suportados',
    description:
      'Converta documentos, imagens, áudio e vídeo com um clique. Nossos servidores equilibram qualidade e velocidade automaticamente.',
    accent: 'from-cyan-500/60 to-emerald-500/60',
  },
  {
    title: 'Limites personalizados por plano',
    description:
      'Controle filas, tamanhos e prioridade de conversão com uma plataforma pensada para equipes híbridas e freelancers.',
    accent: 'from-violet-500/60 to-cyan-500/60',
  },
  {
    title: 'Dashboard em tempo real',
    description:
      'Acompanhe status, histórico e datas de expiração do plano em um painel moderno, pronto para integração com Supabase.',
    accent: 'from-amber-500/60 to-pink-500/60',
  },
]

export function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-16">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-10 py-16">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-900/60 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              Nova experiência de conversão
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Converta qualquer arquivo, em qualquer lugar.
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              O FileFlow entrega conversões rápidas com limites inteligentes para cada plano. Faça
              upload, monitore o progresso e agende upgrades em um painel que parece app nativo.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button onClick={() => navigate({ to: '/convert' })}>
                Começar grátis
              </Button>
              <Link
                to={user ? '/dashboard' : '/login'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
              >
                {user ? 'Ir para Dashboard' : 'Login com Google (mock)'}
              </Link>
            </div>
          </div>
          <div className="relative flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl shadow-emerald-500/10">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Fila ativa</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                03 tarefas
              </span>
            </div>
            <div className="space-y-4">
              <MockConversionRow
                title="relatório-2025.pdf"
                subtitle="PDF -> DOCX"
                progress={82}
                accent="from-cyan-400 to-emerald-400"
              />
              <MockConversionRow
                title="campanha-abril.mov"
                subtitle="MOV -> MP4"
                progress={46}
                accent="from-violet-400 to-cyan-400"
              />
              <MockConversionRow
                title="produto-novo.heic"
                subtitle="HEIC -> JPG"
                progress={18}
                accent="from-amber-400 to-pink-400"
              />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-400">
              Prioridade atual:{' '}
              <strong className="text-emerald-300">{user ? 'Plano ' + user.plan : 'Gratuito'}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {FEATURE_CARDS.map((card) => (
          <article
            key={card.title}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-8"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-10`} />
            <div className="relative z-10 flex h-full flex-col gap-4">
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{card.description}</p>
              <span className="mt-auto text-xs font-semibold uppercase tracking-widest text-cyan-300">
                FileFlow Studio
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 px-10 py-14">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent blur-2xl" />
        <div className="relative z-10 flex flex-col gap-6 text-center">
          <h2 className="text-3xl font-semibold text-white">Planos sob medida para a sua escala</h2>
          <p className="text-slate-300 md:px-32">
            Migre de um plano gratuito para uma experiência ilimitada com um clique. Simulamos upgrades
            instantâneos para acelerar seu fluxo de trabalho enquanto implementamos o gateway real.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link
              to="/plans"
              className="inline-flex items-center rounded-full bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/10 transition hover:bg-white"
            >
              Ver planos
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

type MockConversionRowProps = {
  title: string
  subtitle: string
  progress: number
  accent: string
}

function MockConversionRow({ title, subtitle, progress, accent }: MockConversionRowProps) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{subtitle}</span>
        <span>{progress}%</span>
      </div>
      <p className="truncate text-sm font-medium text-slate-200">{title}</p>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${accent}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
