import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from './UI.jsx'
import styles from './Transfer.module.css'

const fmt    = (n,d=4) => n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})
const fmtUSD = (n) => '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})

export default function Transfer({ wallets, onTransfer }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [type,    setType]    = useState(searchParams.get('type')==='receive'?'receive':'send')
  const [asset,   setAsset]   = useState('BTC')
  const [amount,  setAmount]  = useState('')
  const [address, setAddress] = useState('')
  const [note,    setNote]    = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [errors,  setErrors]  = useState({})

  const wallet     = wallets.find((w) => w.symbol === asset)
  const usdPreview = wallet && amount ? parseFloat(amount) * wallet.usdRate : 0

  useEffect(() => {
    const t = searchParams.get('type')
    if (t === 'send' || t === 'receive') setType(t)
  }, [searchParams])

  const validate = () => {
    const e = {}; const p = parseFloat(amount)
    if (!amount || isNaN(p) || p <= 0) e.amount = 'Enter a valid positive amount'
    else if (type==='send' && p > wallet.balance) e.amount = `Insufficient — max ${fmt(wallet.balance)} ${asset}`
    if (type==='send' && !address.trim()) e.address = 'Recipient address is required'
    else if (type==='send' && address.trim().length < 10) e.address = 'Address too short'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(); if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setLoading(true)
    try {
      const tx = await onTransfer({ type, asset, amount: parseFloat(amount), address, note, usdValue: usdPreview })
      setSuccess({ ...tx, usdValue: usdPreview })
    } catch (err) {
      setErrors({ submit: err.message })
    } finally { setLoading(false) }
  }

  if (success) return (
    <div data-testid="screen-transfer-success" className={`${styles.successRoot} fade-up`}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✅</div>
        <h2 className={styles.successTitle}>Transaction Submitted</h2>
        <p className={styles.successSub}>Pending network confirmation.</p>
        <div data-testid="success-summary" className={styles.summaryBox}>
          {[
            {label:'Type',   value:success.type,              testid:'success-type'},
            {label:'Asset',  value:success.asset,             testid:'success-asset'},
            {label:'Amount', value:`${fmt(success.amount)} ${success.asset}`, testid:'success-amount', mono:true},
            {label:'USD',    value:fmtUSD(success.usdValue),  testid:'success-usd'},
            {label:'Tx ID',  value:success.id,                testid:'success-txid', mono:true},
            {label:'Status', value:success.status,            testid:'success-status'},
          ].map((r) => (
            <div key={r.testid} className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{r.label}</span>
              <span data-testid={r.testid} className={`${styles.summaryValue} ${r.mono?'mono':''}`}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className={styles.successBtns}>
          <button data-testid="btn-new-transfer" onClick={() => { setSuccess(null); setAmount(''); setAddress(''); setNote('') }}
            className={`${styles.btn} ${styles['btn--primary']}`}>New Transfer</button>
          <button data-testid="btn-goto-history" onClick={() => navigate('/history')}
            className={`${styles.btn} ${styles['btn--secondary']}`}>View History</button>
        </div>
      </div>
    </div>
  )

  return (
    <div data-testid="screen-transfer" className={`${styles.root} fade-up`}>
      <div className={styles.inner}>
        <button data-testid="btn-back-dashboard" onClick={() => navigate('/dashboard')} className={styles.back}>← Back</button>
        <h2 className={styles.title}>Transfer Funds</h2>
        <p className={styles.subtitle}>Send or receive crypto assets</p>

        <div data-testid="transfer-type-toggle" className={styles.toggle}>
          {['send','receive'].map((t) => (
            <button key={t} data-testid={`toggle-${t}`} onClick={() => setType(t)}
              className={`${styles.toggleBtn} ${type===t?styles['toggleBtn--active']:''}`}>
              {t==='send'?'↑ Send':'↓ Receive'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} data-testid="form-transfer" noValidate>
          <label className={styles.label}>Asset</label>
          <select data-testid="select-asset" value={asset} onChange={(e) => setAsset(e.target.value)} className={styles.select}>
            {wallets.map((w) => <option key={w.symbol} value={w.symbol}>{w.icon} {w.name} ({w.symbol}) — {fmt(w.balance)} available</option>)}
          </select>

          <label className={styles.label}>Amount</label>
          <div className={styles.amountWrap}>
            <input data-testid="input-amount" type="number" step="any" min="0" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
              className={`${styles.amountInput} mono ${errors.amount?styles['input--error']:''}`} />
            <span className={styles.amountSuffix}>{asset}</span>
          </div>
          {errors.amount && <p data-testid="error-amount" className={styles.errorMsg}>{errors.amount}</p>}
          {amount && !isNaN(parseFloat(amount)) && <p data-testid="usd-preview" className={styles.usdPreview}>≈ {fmtUSD(usdPreview)}</p>}

          {type==='send' && <>
            <label className={styles.label}>Recipient Address</label>
            <input data-testid="input-address" type="text" value={address}
              onChange={(e) => setAddress(e.target.value)} placeholder="0x…"
              className={`${styles.input} mono ${errors.address?styles['input--error']:''}`} />
            {errors.address && <p data-testid="error-address" className={styles.errorMsg}>{errors.address}</p>}
          </>}

          {type==='receive' && wallet && (
            <div data-testid="receive-address" className={styles.receiveBox}>
              <p className={styles.receiveLabel}>Your {asset} deposit address</p>
              <p data-testid="receive-address-value" className={`${styles.receiveAddr} mono`}>{wallet.address}</p>
              <button type="button" data-testid="btn-copy-address"
                onClick={() => navigator.clipboard?.writeText(wallet.address)} className={styles.copyBtn}>Copy Address</button>
            </div>
          )}

          <label className={styles.label}>Note (optional)</label>
          <input data-testid="input-note" type="text" value={note}
            onChange={(e) => setNote(e.target.value)} placeholder="e.g. Payment for services"
            className={styles.input} />

          {errors.submit && <p className={styles.errorMsg}>{errors.submit}</p>}

          <button type="submit" data-testid="btn-submit-transfer" disabled={loading}
            className={`${styles.btn} ${styles['btn--primary']} ${styles['btn--full']}`}>
            {loading ? <><Spinner /> Processing…</> : type==='send' ? '↑ Confirm Send' : '↓ Generate Address'}
          </button>
        </form>
      </div>
    </div>
  )
}
