import { useI18n } from '../../i18n'
import { Card } from '../ui/Card'

/** The shape of the report while the data is on its way. */
export function ReportSkeleton() {
  const { t } = useI18n()

  return (
    <div className="px-6 py-6" role="status" aria-live="polite">
      <span className="sr-only">{t('report.loading')}</span>

      <div className="flex flex-wrap items-center gap-5">
        <div className="size-16 shrink-0 rounded-full bg-surface-sunken" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-surface-sunken" />
          <div className="h-3.5 w-24 rounded bg-surface-sunken" />
        </div>
        <div className="ml-auto flex gap-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="w-24 space-y-2">
              <div className="h-2.5 w-20 rounded bg-surface-sunken" />
              <div className="h-7 w-14 rounded bg-surface-sunken" />
            </div>
          ))}
        </div>
      </div>

      <Card className="mt-6">
        <div className="px-6 py-4">
          <div className="h-3.5 w-48 rounded bg-surface-sunken" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex gap-[3px]">
            {Array.from({ length: 53 }, (_, week) => (
              <div key={week} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, day) => (
                  <div key={day} className="size-2.5 rounded-cell bg-surface-sunken" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
