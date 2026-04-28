import { Badge } from './UI.jsx'
import styles from './Dashboard.module.css'

const fmt    = (n, d=2) => n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})
const fmtUSD = (n) => '$' + fmt(n,2)

export default function Dashboard({ wallets, transactions, onNavigate }) {
  const total  = wallets.reduce((s,w) => s + w.balance * w.usdRate, 0)
  const recent = transactions.slice(0,5)

  return (
    <div data-testid="screen-dashboard" className={`${styles.root} fade-up`}>
      <div className={styles.inner}>

        {/* Hero */}
        <section data-testid="total-balance-card" className={styles.hero}>
          <div className={styles.heroGlow} />
          <p className={styles.heroLabel}>Total Portfolio Value</p>
          <h2 data-testid="total-balance-usd" className={`${styles.heroValue} mono`}>{fmtUSD(total)}</h2>
          <p data-testid="portfolio-change" className={styles.heroChange}>▲ 3.24% today</p>
          <div className={styles.heroBtns}>
            <button data-testid="btn-goto-send"    onClick={() => onNavigate('/transfer?type=send')}    className={`${styles.heroBtn} ${styles['heroBtn--primary']}`}>↑ Send</button>
            <button data-testid="btn-goto-receive" onClick={() => onNavigate('/transfer?type=receive')} className={`${styles.heroBtn} ${styles['heroBtn--secondary']}`}>↓ Receive</button>
          </div>
        </section>

        {/* Wallets */}
        <section>
          <h3 className={styles.sectionTitle}>My Wallets</h3>
          <div data-testid="wallet-grid" className={styles.walletGrid}>
            {wallets.map((w) => (
              <article key={w.id} data-testid={`wallet-card-${w.symbol.toLowerCase()}`}
                className={styles.walletCard} style={{'--wc': w.color}}>
                <div className={styles.walletHeader}>
                  <div className={styles.walletIcon} style={{background:w.color+'22',color:w.color}}>{w.icon}</div>
                  <div><div className={styles.walletName}>{w.name}</div><div className={styles.walletSym}>{w.symbol}</div></div>
                </div>
                <div data-testid={`balance-${w.symbol.toLowerCase()}`} className={`${styles.walletBal} mono`}>
                  {fmt(w.balance,4)} <span className={styles.walletBalSym}>{w.symbol}</span>
                </div>
                <div data-testid={`balance-usd-${w.symbol.toLowerCase()}`} className={styles.walletUSD}>{fmtUSD(w.balance*w.usdRate)}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Recent */}
        <section>
          <div className={styles.sectionRow}>
            <h3 className={styles.sectionTitle} style={{marginBottom:0}}>Recent Activity</h3>
            <button data-testid="btn-view-all-transactions" onClick={() => onNavigate('/history')} className={styles.viewAll}>View all →</button>
          </div>
          <div data-testid="recent-transactions" className={styles.txList}>
            {recent.map((tx,i) => (
              <div key={tx.id} data-testid={`tx-row-${tx.id}`} className={styles.txRow}
                style={{borderBottom: i<recent.length-1 ? '1px solid var(--border)' : 'none'}}>
                <div className={styles.txIcon} style={{background: tx.type==='receive' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.12)'}}>
                  {tx.type==='receive' ? '↙' : '↗'}
                </div>
                <div className={styles.txMeta}>
                  <div className={styles.txLabel}>{tx.type==='receive'?'Received':'Sent'} {tx.asset}</div>
                  <div className={styles.txDate}>{new Date(tx.date).toLocaleDateString()}</div>
                </div>
                <div className={styles.txRight}>
                  <div className={`${styles.txAmount} mono`} style={{color: tx.type==='receive'?'var(--green)':'var(--text)'}}>
                    {tx.type==='receive'?'+':'-'}{fmt(tx.amount,4)} {tx.asset}
                  </div>
                  <Badge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
