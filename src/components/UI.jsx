import styles from './UI.module.css'

export function Toast({ toasts }) {
  return (
    <div className={styles.toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} data-testid={`toast-${t.type}`}
          className={`${styles.toast} ${styles[`toast--${t.type}`]} slide-down`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

export function Spinner({ size = 18 }) {
  return <span data-testid="spinner" className={styles.spinner} style={{ width: size, height: size }} />
}

export function Badge({ status }) {
  return (
    <span data-testid={`status-badge-${status}`} className={`${styles.badge} ${styles[`badge--${status}`]}`}>
      {status}
    </span>
  )
}

export function StatusPill({ apiOnline, wsConnected }) {
  let label, cls
  if (apiOnline && wsConnected)  { label = 'Live';     cls = 'live'    }
  else if (wsConnected)          { label = 'WS only';  cls = 'partial' }
  else if (apiOnline)            { label = 'API only'; cls = 'partial' }
  else                           { label = 'Offline';  cls = 'offline' }
  return (
    <div data-testid="connection-status" data-status={cls}
      className={`${styles.pill} ${styles[`pill--${cls}`]}`}
      title={`API: ${apiOnline ? 'online' : 'offline'} · WS: ${wsConnected ? 'connected' : 'disconnected'}`}>
      <span className={styles.pillDot} />
      <span>{label}</span>
    </div>
  )
}

const NAV_TABS = [
  { path: '/dashboard', label: 'Dashboard', icon: '⬡', testid: 'nav-dashboard' },
  { path: '/transfer',  label: 'Transfer',  icon: '⇄', testid: 'nav-transfer'  },
  { path: '/history',   label: 'History',   icon: '≡', testid: 'nav-history'   },
]

export function NavBar({ currentPath, onNavigate, user, onLogout, apiOnline, wsConnected }) {
  return (
    <nav data-testid="nav-bar" className={styles.navbar}>
      <div className={styles.navBrand}>
        <span className={styles.navLogo}>⬡</span>
        <span className={styles.navTitle}>VaultX</span>
      </div>
      <div className={styles.navTabs}>
        {NAV_TABS.map((t) => (
          <button key={t.path} data-testid={t.testid} onClick={() => onNavigate(t.path)}
            className={`${styles.navTab} ${currentPath.startsWith(t.path) ? styles['navTab--active'] : ''}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.navUser}>
        <StatusPill apiOnline={apiOnline} wsConnected={wsConnected} />
        <div data-testid="user-avatar" className={styles.navAvatar}>{user?.avatar}</div>
        <span data-testid="user-name" className={styles.navUserName}>{user?.name}</span>
        <button data-testid="btn-logout" onClick={onLogout} className={styles.navLogout}>Logout</button>
      </div>
    </nav>
  )
}
