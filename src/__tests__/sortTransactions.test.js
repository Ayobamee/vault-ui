import { describe, it, expect } from 'vitest'
import { sortTransactions } from '../utils/sortTransactions.js'

const transactions = [
  { id: 'tx001', amount: 0.5,  date: '2024-01-15T10:00:00Z' },
  { id: 'tx002', amount: 2.0,  date: '2024-03-20T14:30:00Z' },
  { id: 'tx003', amount: 0.1,  date: '2024-02-10T09:15:00Z' },
  { id: 'tx004', amount: 10.0, date: '2024-01-01T00:00:00Z' },
  { id: 'tx005', amount: 500,  date: '2024-04-05T18:00:00Z' },
]

describe('sortTransactions', () => {
  // ── Sort by date ──────────────────────────────────────────────────────────
  it('sorts by date descending (newest first) by default', () => {
    const result = sortTransactions(transactions)
    expect(result[0].id).toBe('tx005') // Apr
    expect(result[4].id).toBe('tx004') // Jan 1
  })

  it('sorts by date ascending (oldest first)', () => {
    const result = sortTransactions(transactions, 'date', 'asc')
    expect(result[0].id).toBe('tx004') // Jan 1
    expect(result[4].id).toBe('tx005') // Apr
  })

  // ── Sort by amount ────────────────────────────────────────────────────────
  it('sorts by amount descending (largest first)', () => {
    const result = sortTransactions(transactions, 'amount', 'desc')
    expect(result[0].id).toBe('tx005') // 500
    expect(result[4].id).toBe('tx003') // 0.1
  })

  it('sorts by amount ascending (smallest first)', () => {
    const result = sortTransactions(transactions, 'amount', 'asc')
    expect(result[0].id).toBe('tx003') // 0.1
    expect(result[4].id).toBe('tx005') // 500
  })

  // ── Does not mutate ───────────────────────────────────────────────────────
  it('does not mutate the original array', () => {
    const original = transactions.map(t => t.id)
    sortTransactions(transactions, 'amount', 'asc')
    expect(transactions.map(t => t.id)).toEqual(original)
  })

  // ── Edge cases ────────────────────────────────────────────────────────────
  it('returns empty array for non-array input', () => {
    expect(sortTransactions(null)).toEqual([])
    expect(sortTransactions(undefined)).toEqual([])
  })

  it('returns same single-item array', () => {
    const single = [transactions[0]]
    expect(sortTransactions(single)).toHaveLength(1)
  })

  it('returns original order for unknown sort field', () => {
    const result = sortTransactions(transactions, 'unknown')
    expect(result).toHaveLength(5)
  })
})
