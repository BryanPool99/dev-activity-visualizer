type StatTileProps = {
  label: string
  value: string
  /** A short reading under the value. */
  hint?: string
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="px-3 first:pl-0 sm:px-6 sm:first:pl-0">
      <dt className="label-xs text-ink-subtle">{label}</dt>
      <dd className="nums mt-1 text-xl font-semibold text-ink sm:text-2xl">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  )
}
