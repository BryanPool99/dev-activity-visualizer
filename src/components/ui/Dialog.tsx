import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    triggerRef.current = previouslyFocused

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
      triggerRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  /*
   * The dialog is portalled to the body on purpose. Any ancestor with a
   * `backdrop-filter` — the sticky header has one — becomes the containing
   * block of its `position: fixed` descendants, and the overlay would then be
   * measured against the header instead of the viewport. The same happens to
   * the page wrapper while its entrance animation is running.
   */
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <div
        className="absolute inset-0 bg-scrim"
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
    </div>,
    document.body,
  )
}
