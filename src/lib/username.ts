/** GitHub usernames: 1–39 chars, alphanumerics and single hyphens, cannot start or end with a hyphen. */
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/

/** Trims, drops a leading @, and lowercases — GitHub usernames are case-insensitive. */
export function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@+/, '').toLowerCase()
}

export function isValidUsername(raw: string): boolean {
  return USERNAME_PATTERN.test(normalizeUsername(raw))
}
