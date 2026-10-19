import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`rounded-card border border-line bg-ground ${className}`}>{children}</section>
  )
}

type CardHeaderProps = {
  title: string
  meta?: ReactNode
  action?: ReactNode
}

export function CardHeader({ title, meta, action }: CardHeaderProps) {
  return (
    <header className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <div className="flex items-center gap-3">
        {meta ? <span className="text-xs text-ink-muted">{meta}</span> : null}
        {action}
      </div>
    </header>
  )
}
