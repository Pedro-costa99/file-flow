import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>(c) {new Date().getFullYear()} FileFlow. Converta qualquer arquivo em qualquer lugar.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/plans" className="hover:text-white transition-colors">
            Planos
          </Link>
          <Link to="/convert" className="hover:text-white transition-colors">
            Conversor
          </Link>
          <Link to="/login" className="hover:text-white transition-colors">
            Entrar
          </Link>
        </div>
      </div>
    </footer>
  )
}


