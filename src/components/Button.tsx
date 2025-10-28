import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-cyan-400',
  secondary:
    'bg-slate-800/70 text-slate-100 border border-slate-700 hover:border-slate-500 hover:bg-slate-800',
  ghost: 'text-slate-200 hover:text-white hover:bg-slate-800/60',
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '', ...rest } = props
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
    VARIANT_CLASS[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

