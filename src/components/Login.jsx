import { useState, useRef } from 'react'
import { USERS } from '../data/seed.js'
import { Spinner } from './UI.jsx'
import styles from './Login.module.css'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show2FA, setShow2FA]   = useState(false)
  const [code, setCode]         = useState(['','','','','',''])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [pending, setPending]   = useState(null)
  const refs = useRef([])

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    await sleep(900)
    const user = USERS.find((u) => u.email === email && u.password === password)
    setLoading(false)
    if (!user) { setError('Invalid email or password.'); return }
    setPending(user); setShow2FA(true)
  }

  const handleCodeInput = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...code]; next[i] = val; setCode(next)
    if (val && i < 5) refs.current[i+1]?.focus()
  }

  const handleCodeKey = (i, e) => { if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i-1]?.focus() }

  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    if (p.length === 6) { setCode(p.split('')); refs.current[5]?.focus() }
  }

  const handle2FA = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    await sleep(700); setLoading(false)
    if (code.join('') !== pending.twoFACode) { setError('Invalid verification code.'); return }
    onLogin(pending)
  }

  if (show2FA) return (
    <main data-testid="screen-2fa" className={styles.root}>
      <div className={`${styles.card} fade-up`}>
        <div className={styles.header}>
          <div className={styles.icon}>🔐</div>
          <h1 className={styles.title}>Two-Factor Auth</h1>
          <p className={styles.sub}>Code for <strong>{pending.email}</strong></p>
          <p className={styles.hint}>(Hint: check seed data 😉)</p>
        </div>
        <form onSubmit={handle2FA} data-testid="form-2fa">
          <div className={styles.otpRow} onPaste={handlePaste}>
            {code.map((d, i) => (
              <input key={i} ref={(el) => (refs.current[i] = el)}
                data-testid={`otp-input-${i}`} value={d} maxLength={1} inputMode="numeric"
                onChange={(e) => handleCodeInput(i, e.target.value)}
                onKeyDown={(e) => handleCodeKey(i, e)}
                className={`${styles.otpBox} mono ${d ? styles['otpBox--filled'] : ''}`} />
            ))}
          </div>
          {error && <p data-testid="error-2fa" className={styles.error}>{error}</p>}
          <button type="submit" data-testid="btn-verify-2fa"
            disabled={loading || code.join('').length < 6}
            className={`${styles.btn} ${styles['btn--primary']}`}>
            {loading ? <><Spinner /> Verifying…</> : 'Verify & Sign In'}
          </button>
          <button type="button" data-testid="btn-back-login"
            onClick={() => { setShow2FA(false); setCode(['','','','','','']); setError('') }}
            className={`${styles.btn} ${styles['btn--ghost']}`}>← Back to login</button>
        </form>
      </div>
    </main>
  )

  return (
    <main data-testid="screen-login" className={styles.root}>
      <div className={`${styles.loginWrap} fade-up`}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⬡</span>
          <h1 className={styles.brandName}>VaultX</h1>
          <p className={styles.brandTag}>Your crypto command centre</p>
        </div>
        <div className={styles.card}>
          <h2 style={{fontSize:18,fontWeight:700,marginBottom:24}}>Sign in</h2>
          <form onSubmit={handleLogin} data-testid="form-login">
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" data-testid="input-email" type="email" value={email} required
              onChange={(e) => setEmail(e.target.value)} placeholder="you@vaultx.io"
              className={styles.input} />
            <label className={styles.label} htmlFor="password">Password</label>
            <input id="password" data-testid="input-password" type="password" value={password} required
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className={styles.input} />
            {error && <p data-testid="error-login" className={styles.error}>{error}</p>}
            <button type="submit" data-testid="btn-login" disabled={loading}
              className={`${styles.btn} ${styles['btn--primary']}`}>
              {loading ? <><Spinner /> Signing in…</> : 'Continue →'}
            </button>
          </form>
          <div data-testid="test-credentials" className={styles.creds}>
            <p style={{fontWeight:600,color:'var(--text)',marginBottom:4}}>🧪 Test Credentials</p>
            <p className="mono">qa@vaultx.io / Test@1234</p>
            <p className="mono">intern@vaultx.io / Intern@99</p>
          </div>
        </div>
      </div>
    </main>
  )
}
