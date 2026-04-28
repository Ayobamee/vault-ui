import { useState, useEffect, useCallback, useRef } from 'react'
import { api, connectWS, onWS } from '../api/client.js'
import { INITIAL_WALLETS, INITIAL_TRANSACTIONS } from '../data/seed.js'

let _activeUserId = null

export function useAppState() {
  const [user,         setUser]         = useState(null)
  const [wallets,      setWallets]      = useState(INITIAL_WALLETS)
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [toasts,       setToasts]       = useState([])
  const [apiOnline,    setApiOnline]    = useState(false)
  const [wsConnected,  setWsConnected]  = useState(false)
  const unsubs = useRef([])

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const loadFromAPI = useCallback(async (userId) => {
    try {
      const snap = await api.snapshot()
      const userWallets = snap.data.wallets.filter((w) => w.userId === userId)
      const userTxs = snap.data.transactions
        .filter((t) => t.userId === userId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      if (userWallets.length) setWallets(userWallets)
      if (userTxs.length)    setTransactions(userTxs)
      setApiOnline(true)
    } catch {
      setApiOnline(false)
      addToast('API offline — using local seed data', 'warning')
    }
  }, [addToast])

  useEffect(() => {
    connectWS(() => setWsConnected(true))

    unsubs.current = [
      onWS('wallet:created',      (w)  => { if (w.userId !== _activeUserId) return; setWallets((p) => [...p.filter((x) => x.id !== w.id), w]); addToast(`Wallet created: ${w.symbol}`) }),
      onWS('wallet:updated',      (w)  => { if (w.userId !== _activeUserId) return; setWallets((p) => p.map((x) => x.id === w.id ? w : x)) }),
      onWS('wallet:deleted',      ({id, userId}) => { if (userId !== _activeUserId) return; setWallets((p) => p.filter((x) => x.id !== id)); addToast('Wallet removed', 'info') }),
      onWS('transaction:created', (tx) => { if (tx.userId !== _activeUserId) return; setTransactions((p) => [tx, ...p]); addToast(`New tx: ${tx.type} ${tx.amount} ${tx.asset}`) }),
      onWS('transaction:updated', (tx) => { if (tx.userId !== _activeUserId) return; setTransactions((p) => p.map((x) => x.id === tx.id ? tx : x)); addToast(`Tx ${tx.id} → ${tx.status}`, 'info') }),
      onWS('transaction:deleted', ({id}) => { setTransactions((p) => p.filter((x) => x.id !== id)); addToast('Transaction deleted', 'info') }),
      onWS('db:reset', (snap) => {
        if (!_activeUserId) return
        setWallets(snap.wallets.filter((w) => w.userId === _activeUserId))
        setTransactions(snap.transactions.filter((t) => t.userId === _activeUserId).sort((a,b) => new Date(b.date)-new Date(a.date)))
        addToast('🔄 DB reset by API — UI refreshed', 'warning')
      }),
    ]
    return () => { unsubs.current.forEach((u) => u()); setWsConnected(false) }
  }, [addToast])

  const login = useCallback(async (u) => {
    setUser(u); _activeUserId = u.id
    addToast(`Welcome back, ${u.name}! 👋`)
    await loadFromAPI(u.id)
  }, [addToast, loadFromAPI])

  const logout = useCallback(() => {
    setUser(null); _activeUserId = null
    setWallets(INITIAL_WALLETS)
    setTransactions(INITIAL_TRANSACTIONS)
    addToast('Logged out successfully.', 'info')
  }, [addToast])

  const submitTransfer = useCallback(async ({ type, asset, amount, address, note, usdValue }) => {
    if (!user) throw new Error('Not logged in')
    if (apiOnline) {
      const res = await api.createTransaction({
        userId: user.id, type, asset, amount,
        from: type === 'send' ? 'My Wallet' : (address || 'External'),
        to:   type === 'send' ? address     : 'My Wallet',
        note: note || '', status: 'pending',
      })
      return res.data
    }
    // Offline fallback
    const newTx = {
      id: 'tx' + String(Date.now()).slice(-8), userId: user.id,
      type, asset, amount, usdValue,
      from: type === 'send' ? 'My Wallet' : (address || 'External'),
      to:   type === 'send' ? address     : 'My Wallet',
      date: new Date().toISOString(), status: 'pending', note: note || '',
    }
    setTransactions((p) => [newTx, ...p])
    setWallets((p) => p.map((w) => w.symbol !== asset ? w : { ...w, balance: type === 'send' ? Math.max(0, w.balance - amount) : w.balance + amount }))
    addToast(`${type === 'send' ? 'Sent' : 'Receive'} ${amount} ${asset} (offline)`)
    return newTx
  }, [user, apiOnline, addToast])

  return { user, wallets, transactions, toasts, apiOnline, wsConnected, login, logout, submitTransfer, addToast }
}
