import { useState } from 'react'
import { useI18n } from '../../i18n'
import { useToken, verifyToken } from '../../state/TokenContext'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

export function TokenButton() {
  const { t } = useI18n()
  const { hasToken, setToken } = useToken()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

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
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <span className="sm:hidden">{hasToken ? t('token.connectedShort') : t('token.connectShort')}</span>
        <span className="hidden sm:inline">{hasToken ? t('token.connected') : t('token.connect')}</span>
      </Button>

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
            <div className="flex gap-2">
              {hasToken ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setToken(null)
                    setOpen(false)
                  }}
                >
                  {t('token.clear')}
                </Button>
              ) : null}
              <Button variant="primary" onClick={onSave} disabled={busy || !draft.trim()}>
                {t('token.save')}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
