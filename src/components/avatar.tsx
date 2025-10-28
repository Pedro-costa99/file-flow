type AvatarProps = {
  name: string
  color?: string
  size?: 'sm' | 'md'
}

export function Avatar({ name, color = '#38bdf8', size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const dimensions = size === 'md' ? 'h-10 w-10 text-base' : 'h-8 w-8 text-sm'

  return (
    <div
      className={`flex ${dimensions} items-center justify-center rounded-xl font-semibold text-slate-950`}
      style={{ backgroundColor: color }}
    >
      {initials || 'FF'}
    </div>
  )
}

