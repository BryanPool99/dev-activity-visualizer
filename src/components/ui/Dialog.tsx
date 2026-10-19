import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const firstField = panelRef.current?.querySelector<HTMLElement>(
      'input, button, [href], textarea, select',
    )
    firstField?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <div
        className="absolute inset-0 bg-ink/25"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-card border border-line bg-ground p-6 shadow-lg"
      >
        {children}
      </div>
    </div>
  )
}
