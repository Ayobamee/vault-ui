/**
 * Formats a number as a currency string.
 * Pure function — deterministic output for any input.
 * @param {number} amount
 * @param {string} currency - e.g. 'USD', 'NGN'
 * @param {number} decimals - decimal places (default 2)
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—'
  }

  const symbols = { USD: '$', NGN: '₦', EUR: '€', GBP: '£' }
  const symbol = symbols[currency] ?? currency + ' '

  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`
}

/**
 * Formats a crypto amount with up to 8 decimal places.
 * @param {number} amount
 * @param {number} decimals
 * @returns {string}
 */
export function formatCrypto(amount, decimals = 4) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—'
  }
  return Number(amount).toFixed(decimals)
}
