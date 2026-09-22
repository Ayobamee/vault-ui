/**
 * Sorts a transactions array by a given field and direction.
 * Pure function — returns a new array, does not mutate input.
 * @param {Array} transactions
 * @param {'date' | 'amount'} sortBy
 * @param {'asc' | 'desc'} direction
 * @returns {Array}
 */
export function sortTransactions(transactions, sortBy = 'date', direction = 'desc') {
  if (!Array.isArray(transactions)) return []

  return [...transactions].sort((a, b) => {
    let valA, valB

    if (sortBy === 'date') {
      valA = new Date(a.date).getTime()
      valB = new Date(b.date).getTime()
    } else if (sortBy === 'amount') {
      valA = a.amount
      valB = b.amount
    } else {
      return 0
    }

    return direction === 'asc' ? valA - valB : valB - valA
  })
}
