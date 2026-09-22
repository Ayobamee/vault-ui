import { describe, it, expect } from 'vitest'
import { formatAuthError } from '../utils/formatAuthError.js'

describe('formatAuthError', () => {
  // ── HTTP status codes ─────────────────────────────────────────────────────
  it('returns correct message for 400', () => {
    expect(formatAuthError(400)).toBe('Invalid request. Please check your details.')
  })

  it('returns correct message for 401 (wrong credentials)', () => {
    expect(formatAuthError(401)).toBe('Invalid credentials. Please try again.')
  })

  it('returns correct message for 403 (forbidden)', () => {
    expect(formatAuthError(403)).toBe('Access denied.')
  })

  it('returns correct message for 404 (account not found)', () => {
    expect(formatAuthError(404)).toBe('Account not found.')
  })

  it('returns correct message for 429 (rate limited)', () => {
    expect(formatAuthError(429)).toBe('Too many attempts. Please wait before trying again.')
  })

  it('returns correct message for 500 (server error)', () => {
    expect(formatAuthError(500)).toBe('Server error. Please try again later.')
  })

  // ── Named error types ─────────────────────────────────────────────────────
  it('returns correct message for network error', () => {
    expect(formatAuthError('network')).toBe('Network error. Check your connection.')
  })

  it('returns correct message for invalid_otp', () => {
    expect(formatAuthError('invalid_otp')).toBe('Invalid verification code. Please try again.')
  })

  it('returns correct message for expired_otp', () => {
    expect(formatAuthError('expired_otp')).toBe('Verification code has expired. Request a new one.')
  })

  it('returns correct message for account_locked', () => {
    expect(formatAuthError('account_locked')).toBe('Account locked due to too many failed attempts.')
  })

  // ── Fallback ──────────────────────────────────────────────────────────────
  it('returns fallback message for unknown error code', () => {
    expect(formatAuthError(999)).toBe('Something went wrong. Please try again.')
  })

  it('returns fallback message for null', () => {
    expect(formatAuthError(null)).toBe('Something went wrong. Please try again.')
  })

  it('returns fallback for completely unknown string', () => {
    expect(formatAuthError('mystery_error')).toBe('Something went wrong. Please try again.')
  })
})
