import { describe, it, expect } from 'vitest'
import { validatePassword } from '../utils/validatePassword.js'

describe('validatePassword', () => {
  // ── Happy path ────────────────────────────────────────────────────────────
  it('returns valid for a strong password', () => {
    const result = validatePassword('Test@1234')
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('returns valid for password with multiple special chars', () => {
    const result = validatePassword('V@ultX#99')
    expect(result.valid).toBe(true)
  })

  // ── Too short ─────────────────────────────────────────────────────────────
  it('returns invalid when password is less than 8 characters', () => {
    const result = validatePassword('Ab1@')
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/8 characters/)
  })

  // ── Missing uppercase ─────────────────────────────────────────────────────
  it('returns invalid when password has no uppercase letter', () => {
    const result = validatePassword('test@1234')
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/uppercase/)
  })

  // ── Missing number ────────────────────────────────────────────────────────
  it('returns invalid when password has no number', () => {
    const result = validatePassword('Test@abcd')
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/number/)
  })

  // ── Missing special character ─────────────────────────────────────────────
  it('returns invalid when password has no special character', () => {
    const result = validatePassword('Test1234')
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/special character/)
  })

  // ── Empty / null ──────────────────────────────────────────────────────────
  it('returns invalid for empty string', () => {
    const result = validatePassword('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Password is required')
  })

  it('returns invalid for null', () => {
    const result = validatePassword(null)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Password is required')
  })
})
