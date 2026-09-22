import { describe, it, expect } from 'vitest'
import { filterTransactions } from '../utils/filterTransactions.js'

// ── Shared seed data ──────────────────────────────────────────────────────────
const transactions = [
  { id: 'tx001', type: 'send',    status: 'completed', asset: 'BTC', amount: 0.5,  note: 'Payment',    from: 'My Wallet', to: '1A2B3C' },
  { id: 'tx002', type: 'receive', status: 'completed', asset: 'ETH', amount: 2.0,  note: 'Refund',     from: '0xABCD',    to: 'My Wallet' },
  { id: 'tx003', type: 'send',    status: 'pending',   asset: 'BTC', amount: 0.1,  note: 'Lunch',      from: 'My Wallet', to: '4D5E6F' },
  { id: 'tx004', type: 'receive', status: 'failed',    asset: 'SOL', amount: 10.0, note: 'Freelance',  from: 'GH7I8J',    to: 'My Wallet' },
  { id: 'tx005', type: 'send',    status: 'completed', asset: 'USDT',amount: 500,  note: 'Rent',       from: 'My Wallet', to: 'K9L0M1' },
]

describe('filterTransactions', () => {
  // ── No filters ────────────────────────────────────────────────────────────
  it('returns all transactions when no filters are applied', () => {
    expect(filterTransactions(transactions, {})).toHaveLength(5)
  })

  // ── Type filter ───────────────────────────────────────────────────────────
  it('filters by type: send', () => {
    const result = filterTransactions(transactions, { type: 'send' })
    expect(result).toHaveLength(3)
    result.forEach(tx => expect(tx.type).toBe('send'))
  })

  it('filters by type: receive', () => {
    const result = filterTransactions(transactions, { type: 'receive' })
    expect(result).toHaveLength(2)
    result.forEach(tx => expect(tx.type).toBe('receive'))
  })

  it('returns all when type is "all"', () => {
    expect(filterTransactions(transactions, { type: 'all' })).toHaveLength(5)
  })

  // ── Status filter ─────────────────────────────────────────────────────────
  it('filters by status: completed', () => {
    const result = filterTransactions(transactions, { status: 'completed' })
    expect(result).toHaveLength(3)
    result.forEach(tx => expect(tx.status).toBe('completed'))
  })

  it('filters by status: pending', () => {
    const result = filterTransactions(transactions, { status: 'pending' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tx003')
  })

  it('filters by status: failed', () => {
    const result = filterTransactions(transactions, { status: 'failed' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tx004')
  })

  // ── Asset filter ──────────────────────────────────────────────────────────
  it('filters by asset: BTC', () => {
    const result = filterTransactions(transactions, { asset: 'BTC' })
    expect(result).toHaveLength(2)
    result.forEach(tx => expect(tx.asset).toBe('BTC'))
  })

  it('filters by asset: SOL', () => {
    const result = filterTransactions(transactions, { asset: 'SOL' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tx004')
  })

  // ── Search filter ─────────────────────────────────────────────────────────
  it('filters by search term matching note', () => {
    const result = filterTransactions(transactions, { search: 'Rent' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tx005')
  })

  it('filters by search term matching tx id', () => {
    const result = filterTransactions(transactions, { search: 'tx002' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tx002')
  })

  it('search is case-insensitive', () => {
    const result = filterTransactions(transactions, { search: 'freelance' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tx004')
  })

  // ── Combined filters ──────────────────────────────────────────────────────
  it('combines type and asset filters correctly', () => {
    const result = filterTransactions(transactions, { type: 'send', asset: 'BTC' })
    expect(result).toHaveLength(2)
    result.forEach(tx => {
      expect(tx.type).toBe('send')
      expect(tx.asset).toBe('BTC')
    })
  })

  it('returns empty array when no matches found', () => {
    const result = filterTransactions(transactions, { asset: 'DOGE' })
    expect(result).toHaveLength(0)
  })

  // ── Edge cases ────────────────────────────────────────────────────────────
  it('returns empty array for non-array input', () => {
    expect(filterTransactions(null)).toEqual([])
    expect(filterTransactions(undefined)).toEqual([])
  })

  it('does not mutate the original array', () => {
    const original = [...transactions]
    filterTransactions(transactions, { type: 'send' })
    expect(transactions).toEqual(original)
  })
})
