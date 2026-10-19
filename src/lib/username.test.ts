import { describe, expect, it } from 'vitest'
import { isValidUsername, normalizeUsername } from './username'

describe('normalizeUsername', () => {
  it('trims whitespace', () => {
    expect(normalizeUsername('  torvalds  ')).toBe('torvalds')
  })

  it('drops a leading @', () => {
    expect(normalizeUsername('@torvalds')).toBe('torvalds')
  })

  it('lowercases, because GitHub usernames are case-insensitive', () => {
    expect(normalizeUsername('TorValds')).toBe('torvalds')
  })

  it('keeps inner hyphens', () => {
    expect(normalizeUsername('some-dev')).toBe('some-dev')
  })
})

describe('isValidUsername', () => {
  it('accepts ordinary usernames', () => {
    expect(isValidUsername('torvalds')).toBe(true)
    expect(isValidUsername('some-dev')).toBe(true)
    expect(isValidUsername('dev123')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidUsername('')).toBe(false)
    expect(isValidUsername('   ')).toBe(false)
  })

  it('rejects a leading or trailing hyphen', () => {
    expect(isValidUsername('-dev')).toBe(false)
    expect(isValidUsername('dev-')).toBe(false)
  })

  it('rejects double hyphens and illegal characters', () => {
    expect(isValidUsername('some--dev')).toBe(false)
    expect(isValidUsername('some dev')).toBe(false)
    expect(isValidUsername('some.dev')).toBe(false)
  })
})
