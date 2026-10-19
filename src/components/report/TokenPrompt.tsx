import { useState } from 'react'
import { useI18n } from '../../i18n'
import { useToken, verifyToken } from '../../state/TokenContext'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

type TokenPromptProps = {
  days: number
}

/**
 * The report says what it is missing and offers the fix. A partial reading is
 * never presented as a whole one.
 */
export function TokenPrompt({ days }: TokenPromptProps) {
  const { t } = useI18n()
  const { hasToken, setToken } = useToken()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (hasToken) return null

  async function onSave() {
    const value = draft.trim()
    if (!value) return
    setBusy(true)
    setError(null)
    try {
      await verifyToken(value)
      setToken(value)
      setOpen(false)
      setDraft('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Invalid token')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface px-6 py-4">
        <p className="text-sm leading-relaxed text-ink-muted">
          {t('report.partialNotice', { days })}
        </p>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          {t('report.connectCta')}
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={t('token.title')}>
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-ink">{t('token.title')}</h2>
          <p className="text-sm leading-relaxed text-ink-muted">{t('token.body')}</p>

          <input
            type="password"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('token.placeholder')}
            aria-label={t('token.placeholder')}
            className="h-9 w-full rounded-control border border-line bg-ground px-3 text-sm outline-none focus:border-accent"
          />

          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-ink-subtle">{t('token.privacy')}</span>
            <Button variant="primary" onClick={onSave} disabled={busy || !draft.trim()}>
              {t('token.save')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
