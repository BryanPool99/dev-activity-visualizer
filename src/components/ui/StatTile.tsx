type StatTileProps = {
  label: string
  value: string
  /** A short reading under the value. */
  hint?: string
  /** `lead` is the report's peak figure; `normal` is a supporting number. */
  size?: 'lead' | 'normal'
}

export function StatTile({ label, value, hint, size = 'normal' }: StatTileProps) {
  const isLead = size === 'lead'

  return (
    <div className="px-3 first:pl-0 sm:px-6 sm:first:pl-0">
      <dt className="label-xs text-ink-subtle">{label}</dt>
      <dd
        className={`nums mt-1 font-semibold text-ink ${
          isLead ? 'text-[40px] leading-[44px] tracking-tight' : 'text-[28px] leading-8'
        }`}
      >
        {value}
      </dd>
      {hint ? <p className="mt-0.5 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  )
}
