type StatTileProps = {
  label: string
  value: string
  /** A short reading under the value. */
  hint?: string
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="px-6 first:pl-0">
      <dt className="label-xs text-ink-subtle">{label}</dt>
      <dd className="nums mt-1 text-2xl font-semibold text-ink">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  )
}
