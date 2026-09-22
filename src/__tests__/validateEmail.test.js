import { describe, it, expect } from 'vitest'
import { validateEmail } from '../utils/validateEmail.js'

describe('validateEmail', () => {
  // ── Happy path ────────────────────────────────────────────────────────────
  it('returns valid for a correctly formatted email', () => {
    const result = validateEmail('qa@vaultx.io')
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns valid for email with subdomains', () => {
    const result = validateEmail('user@mail.vaultx.io')
    expect(result.valid).toBe(true)
  })

  // ── Missing @ ─────────────────────────────────────────────────────────────
  it('returns invalid when @ is missing', () => {
    const result = validateEmail('qavaultx.io')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  // ── Missing domain ────────────────────────────────────────────────────────
  it('returns invalid when domain has no dot', () => {
    const result = validateEmail('qa@vaultx')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  // ── Empty / null / undefined ──────────────────────────────────────────────
  it('returns invalid for an empty string', () => {
    const result = validateEmail('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Email is required')
  })

  it('returns invalid for null', () => {
    const result = validateEmail(null)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Email is required')
  })

  it('returns invalid for undefined', () => {
    const result = validateEmail(undefined)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Email is required')
  })

  // ── Whitespace ────────────────────────────────────────────────────────────
  it('returns invalid for whitespace only', () => {
    const result = validateEmail('   ')
    expect(result.valid).toBe(false)
  })
})
