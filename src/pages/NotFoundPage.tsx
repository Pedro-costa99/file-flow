import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 px-10 py-16 text-center">
      <span className="rounded-full bg-cyan-500/10 px-4 py-1 text-xs font-semibold text-cyan-200">
        404
      </span>
      <h2 className="text-3xl font-semibold text-white">Pagina nao encontrada</h2>
      <p className="text-sm text-slate-300">
        A rota que voce procurou ainda nao faz parte do FileFlow. Use o menu para voltar para as páginas
        principais.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          Ir para a home
        </Link>
        <Link
          to="/convert"
          className="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
        >
          Conversor
        </Link>
      </div>
    </div>
  )
}

