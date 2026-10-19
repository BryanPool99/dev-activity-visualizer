import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const base =
  'inline-flex h-9 items-center justify-center gap-2 rounded-control px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-strong disabled:bg-surface-sunken disabled:text-ink-subtle',
  ghost: 'border border-line bg-ground text-ink hover:bg-surface',
}

export function Button({ variant = 'ghost', className = '', ...props }: ButtonProps) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
