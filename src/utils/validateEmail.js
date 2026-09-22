/**
 * Validates an email address format.
 * Pure function — no side effects, no external dependencies.
 * @param {string} email
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }

  const trimmed = email.trim()

  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  if (!trimmed.includes('@')) {
    return { valid: false, error: 'Email must contain @' }
  }

  const [local, domain] = trimmed.split('@')

  if (!local || local.length === 0) {
    return { valid: false, error: 'Email is invalid' }
  }

  if (!domain || !domain.includes('.')) {
    return { valid: false, error: 'Email domain is invalid' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Email format is invalid' }
  }

  return { valid: true, error: null }
}
