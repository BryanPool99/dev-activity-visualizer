import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

type ChartCardProps = {
  title: string
  /** A short reading on the header row, right side. */
  meta?: ReactNode
  /** The chart itself. */
  children: ReactNode
  /** The proof at the foot. */
  footer?: ReactNode
  /** Fills the card's body with less padding, for charts that need the room. */
  tight?: boolean
  /** Extra classes on the body, for charts that need to fill the card. */
  bodyClassName?: string
}

export function ChartCard({
  title,
  meta,
  children,
  footer,
  tight = false,
  bodyClassName = '',
}: ChartCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <header className="flex items-baseline justify-between gap-4 px-6 py-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {meta ? <div className="text-xs text-ink-muted">{meta}</div> : null}
      </header>
      <div className={`flex-1 ${tight ? 'px-6 pb-2' : 'px-6 py-5'} ${bodyClassName}`}>{children}</div>
      {footer ? <div className="px-6 pt-3 pb-5">{footer}</div> : null}
    </Card>
  )
}
