import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCrypto } from '../utils/formatCurrency.js'

describe('formatCurrency', () => {
  // ── USD formatting ────────────────────────────────────────────────────────
  it('formats a standard USD amount correctly', () => {
    expect(formatCurrency(1500.5, 'USD')).toBe('$1,500.50')
  })

  it('formats zero as $0.00', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })

  it('formats large amounts with commas', () => {
    expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00')
  })

  it('formats negative amounts with leading minus', () => {
    expect(formatCurrency(-250, 'USD')).toBe('-$250.00')
  })

  // ── Other currencies ──────────────────────────────────────────────────────
  it('formats NGN with ₦ symbol', () => {
    expect(formatCurrency(5000, 'NGN')).toBe('₦5,000.00')
  })

  it('formats EUR with € symbol', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00')
  })

  // ── Edge cases ────────────────────────────────────────────────────────────
  it('returns — for null', () => {
    expect(formatCurrency(null)).toBe('—')
  })

  it('returns — for NaN', () => {
    expect(formatCurrency(NaN)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(formatCurrency(undefined)).toBe('—')
  })
})

describe('formatCrypto', () => {
  it('formats BTC amount to 4 decimal places by default', () => {
    expect(formatCrypto(0.12345678)).toBe('0.1235')
  })

  it('formats with custom decimal places', () => {
    expect(formatCrypto(1.5, 2)).toBe('1.50')
  })

  it('formats zero correctly', () => {
    expect(formatCrypto(0)).toBe('0.0000')
  })

  it('returns — for null', () => {
    expect(formatCrypto(null)).toBe('—')
  })
})
