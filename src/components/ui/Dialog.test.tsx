import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders into the body, not into whatever ancestor opened it', () => {
    render(
      <div data-testid="host">
        <Dialog open onClose={() => {}} title="Token de GitHub">
          <p>Contenido</p>
        </Dialog>
      </div>,
    )

    const panel = screen.getByRole('dialog')
    const host = screen.getByTestId('host')

    // A fixed overlay inside an ancestor with a backdrop-filter would be
    // measured against that ancestor instead of the viewport.
    expect(host.contains(panel)).toBe(false)
    expect(document.body.contains(panel)).toBe(true)
  })

  it('is an overlay that fills the viewport', () => {
    render(
      <Dialog open onClose={() => {}} title="Token de GitHub">
        <p>Contenido</p>
      </Dialog>,
    )

    const overlay = screen.getByRole('dialog').parentElement

    // jsdom has no layout, so the size is asserted through the classes.
    expect(overlay?.classList.contains('fixed')).toBe(true)
    expect(overlay?.classList.contains('inset-0')).toBe(true)
    expect(overlay?.firstElementChild?.classList.contains('absolute')).toBe(true)
    expect(overlay?.firstElementChild?.classList.contains('inset-0')).toBe(true)
  })

  it('renders nothing when it is closed', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Token de GitHub">
        <p>Contenido</p>
      </Dialog>,
    )

    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
