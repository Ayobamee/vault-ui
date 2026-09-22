import { describe, it, expect } from 'vitest'
import { calculatePortfolioTotal } from '../utils/calculatePortfolioTotal.js'

describe('calculatePortfolioTotal', () => {
  // ── Happy path ────────────────────────────────────────────────────────────
  it('calculates total USD value across multiple wallets', () => {
    const wallets = [
      { symbol: 'BTC',  balance: 1,    usdRate: 60000 },
      { symbol: 'ETH',  balance: 5,    usdRate: 3000 },
      { symbol: 'USDT', balance: 500,  usdRate: 1 },
      { symbol: 'SOL',  balance: 20,   usdRate: 150 },
    ]
    // 60000 + 15000 + 500 + 3000 = 78500
    expect(calculatePortfolioTotal(wallets)).toBe(78500)
  })

  it('returns 0 when all balances are zero', () => {
    const wallets = [
      { symbol: 'BTC', balance: 0, usdRate: 60000 },
      { symbol: 'ETH', balance: 0, usdRate: 3000 },
    ]
    expect(calculatePortfolioTotal(wallets)).toBe(0)
  })

  it('correctly handles a single wallet', () => {
    const wallets = [{ symbol: 'BTC', balance: 2, usdRate: 50000 }]
    expect(calculatePortfolioTotal(wallets)).toBe(100000)
  })

  // ── Edge cases ────────────────────────────────────────────────────────────
  it('returns 0 for empty array', () => {
    expect(calculatePortfolioTotal([])).toBe(0)
  })

  it('returns 0 for null input', () => {
    expect(calculatePortfolioTotal(null)).toBe(0)
  })

  it('returns 0 for undefined input', () => {
    expect(calculatePortfolioTotal(undefined)).toBe(0)
  })

  it('handles wallets with missing usdRate gracefully', () => {
    const wallets = [{ symbol: 'BTC', balance: 2 }]
    expect(calculatePortfolioTotal(wallets)).toBe(0) // rate defaults to 0
  })

  it('handles wallets with missing balance gracefully', () => {
    const wallets = [{ symbol: 'BTC', usdRate: 60000 }]
    expect(calculatePortfolioTotal(wallets)).toBe(0) // balance defaults to 0
  })
})
