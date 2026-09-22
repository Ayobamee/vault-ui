/**
 * Filters a transactions array by given criteria.
 * Pure function — does not mutate the input array.
 * @param {Array} transactions
 * @param {{ type?: string, status?: string, asset?: string, search?: string }} filters
 * @returns {Array}
 */
export function filterTransactions(transactions, filters = {}) {
  if (!Array.isArray(transactions)) return []

  const { type, status, asset, search } = filters

  return transactions.filter((tx) => {
    if (type && type !== 'all' && tx.type !== type) return false
    if (status && status !== 'all' && tx.status !== status) return false
    if (asset && asset !== 'all' && tx.asset !== asset) return false

    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase()
      const searchable = [tx.asset, tx.id, tx.note, tx.to, tx.from]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!searchable.includes(q)) return false
    }

    return true
  })
}
