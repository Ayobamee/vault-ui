import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAppState }    from './hooks/useAppState.js'
import { Toast, NavBar }  from './components/UI.jsx'
import Login     from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Transfer  from './components/Transfer.jsx'
import History   from './components/History.jsx'

function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, wallets, transactions, toasts, apiOnline, wsConnected, login, logout, submitTransfer } = useAppState()

  useEffect(() => {
    if (user && location.pathname === '/login') navigate('/dashboard', { replace: true })
  }, [user, location.pathname, navigate])

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  return (
    <>
      <Toast toasts={toasts} />
      {user && (
        <NavBar currentPath={location.pathname} onNavigate={navigate}
          user={user} onLogout={handleLogout} apiOnline={apiOnline} wsConnected={wsConnected} />
      )}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />} />
        <Route path="/dashboard" element={<RequireAuth user={user}><Dashboard wallets={wallets} transactions={transactions} onNavigate={navigate} /></RequireAuth>} />
        <Route path="/transfer"  element={<RequireAuth user={user}><Transfer  wallets={wallets} onTransfer={submitTransfer} /></RequireAuth>} />
        <Route path="/history"   element={<RequireAuth user={user}><History   transactions={transactions} /></RequireAuth>} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </>
  )
}
