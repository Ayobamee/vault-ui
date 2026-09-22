/**
 * Calculates total portfolio value in USD across all wallets.
 * Pure function — no side effects.
 * @param {Array<{ balance: number, usdRate: number }>} wallets
 * @returns {number} total USD value
 */
export function calculatePortfolioTotal(wallets) {
  if (!Array.isArray(wallets) || wallets.length === 0) return 0

  return wallets.reduce((total, wallet) => {
    const balance = Number(wallet.balance) || 0
    const rate = Number(wallet.usdRate) || 0
    return total + balance * rate
  }, 0)
}
