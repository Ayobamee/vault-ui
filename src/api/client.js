const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const WS_BASE  = import.meta.env.VITE_WS_URL  || 'ws://localhost:4000'

async function req(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
  return json
}

export const api = {
  health:   ()         => req('GET',    '/api/health'),
  snapshot: ()         => req('GET',    '/api/snapshot'),
  reset:    ()         => req('POST',   '/api/reset'),

  getUsers:    ()      => req('GET',    '/api/users'),
  getUser:     (id)    => req('GET',    `/api/users/${id}`),
  createUser:  (data)  => req('POST',   '/api/users', data),
  updateUser:  (id, d) => req('PATCH',  `/api/users/${id}`, d),
  deleteUser:  (id)    => req('DELETE', `/api/users/${id}`),

  getWallets:   (uid)   => req('GET',    `/api/wallets${uid ? `?userId=${uid}` : ''}`),
  getWallet:    (id)    => req('GET',    `/api/wallets/${id}`),
  createWallet: (data)  => req('POST',   '/api/wallets', data),
  updateWallet: (id, d) => req('PATCH',  `/api/wallets/${id}`, d),
  deleteWallet: (id)    => req('DELETE', `/api/wallets/${id}`),

  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return req('GET', `/api/transactions${qs ? `?${qs}` : ''}`)
  },
  getTransaction:    (id)    => req('GET',    `/api/transactions/${id}`),
  createTransaction: (data)  => req('POST',   '/api/transactions', data),
  updateTransaction: (id, d) => req('PATCH',  `/api/transactions/${id}`, d),
  deleteTransaction: (id)    => req('DELETE', `/api/transactions/${id}`),
}

let socket = null
const listeners = new Map()

export function connectWS(onOpen) {
  if (socket?.readyState === WebSocket.OPEN) { onOpen?.(); return }
  socket = new WebSocket(WS_BASE)
  socket.addEventListener('open', () => { console.log('[WS] Connected'); onOpen?.() })
  socket.addEventListener('message', (e) => {
    try {
      const { event, payload } = JSON.parse(e.data)
      listeners.get(event)?.forEach((cb) => cb(payload))
      listeners.get('*')?.forEach((cb) => cb({ event, payload }))
    } catch {}
  })
  socket.addEventListener('close', () => {
    console.warn('[WS] Disconnected — retrying in 3s')
    socket = null
    setTimeout(() => connectWS(), 3000)
  })
}

export function onWS(event, callback) {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event).add(callback)
  return () => listeners.get(event)?.delete(callback)
}

export { WS_BASE, API_BASE }
