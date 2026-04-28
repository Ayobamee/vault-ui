import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from './UI.jsx'
import styles from './History.module.css'

const fmt    = (n,d=4) => n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})
const fmtUSD = (n) => '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})

export default function History({ transactions }) {
  const navigate = useNavigate()
  const [search,       setSearch]       = useState('')
  const [filterType,   setFilterType]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAsset,  setFilterAsset]  = useState('All Assets')
  const [sortBy,       setSortBy]       = useState('date-desc')

  const filtered = transactions
    .filter((tx) => {
      if (filterType !== 'all' && tx.type !== filterType) return false
      if (filterStatus !== 'all' && tx.status !== filterStatus) return false
      if (filterAsset !== 'All Assets' && tx.asset !== filterAsset) return false
      if (search) {
        const q = search.toLowerCase()
        return tx.asset.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q) ||
          (tx.note && tx.note.toLowerCase().includes(q)) || tx.from.toLowerCase().includes(q) || tx.to.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a,b) => {
      if (sortBy==='date-desc')   return new Date(b.date)-new Date(a.date)
      if (sortBy==='date-asc')    return new Date(a.date)-new Date(b.date)
      if (sortBy==='amount-desc') return b.usdValue-a.usdValue
      if (sortBy==='amount-asc')  return a.usdValue-b.usdValue
      return 0
    })

  const clear = () => { setSearch(''); setFilterType('all'); setFilterStatus('all'); setFilterAsset('All Assets'); setSortBy('date-desc') }
  const totalSent     = transactions.filter(t=>t.type==='send').reduce((s,t)=>s+t.usdValue,0)
  const totalReceived = transactions.filter(t=>t.type==='receive').reduce((s,t)=>s+t.usdValue,0)
  const pendingCount  = transactions.filter(t=>t.status==='pending').length

  return (
    <div data-testid="screen-history" className={`${styles.root} fade-up`}>
      <div className={styles.inner}>
        <button data-testid="btn-back-dashboard-hist" onClick={() => navigate('/dashboard')} className={styles.back}>← Back</button>
        <h2 className={styles.title}>Transaction History</h2>
        <p data-testid="tx-count" className={styles.subtitle}>{filtered.length} transaction{filtered.length!==1?'s':''} found</p>

        <div data-testid="history-summary" className={styles.stats}>
          <div data-testid="stat-total-sent"     className={styles.stat}><p className={styles.statLabel}>Total Sent</p>    <p className={`${styles.statVal} mono`}>{fmtUSD(totalSent)}</p></div>
          <div data-testid="stat-total-received" className={styles.stat}><p className={styles.statLabel}>Total Received</p><p className={`${styles.statVal} mono`}>{fmtUSD(totalReceived)}</p></div>
          <div data-testid="stat-pending-count"  className={styles.stat}><p className={styles.statLabel}>Pending</p>       <p className={`${styles.statVal} mono`}>{pendingCount}</p></div>
        </div>

        <div data-testid="filter-bar" className={styles.filterBar}>
          <input data-testid="input-search" type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="🔍 Search…" className={`${styles.filter} ${styles.searchInput}`} />
          <select data-testid="filter-type"   value={filterType}   onChange={(e)=>setFilterType(e.target.value)}   className={styles.filter}>
            <option value="all">All Types</option><option value="send">Send</option><option value="receive">Receive</option>
          </select>
          <select data-testid="filter-status" value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className={styles.filter}>
            <option value="all">All Status</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option>
          </select>
          <select data-testid="filter-asset"  value={filterAsset}  onChange={(e)=>setFilterAsset(e.target.value)}  className={styles.filter}>
            {['All Assets','BTC','ETH','USDT','SOL'].map(a=><option key={a}>{a}</option>)}
          </select>
          <select data-testid="sort-by" value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className={styles.filter}>
            <option value="date-desc">Newest</option><option value="date-asc">Oldest</option>
            <option value="amount-desc">Highest Value</option><option value="amount-asc">Lowest Value</option>
          </select>
          <button data-testid="btn-clear-filters" onClick={clear} className={styles.clearBtn}>Clear</button>
        </div>

        <div data-testid="transactions-table" className={styles.table}>
          <div className={styles.tableHead}>
            <span>Transaction</span><span>Asset</span><span>Amount</span><span>USD</span><span>Status</span>
          </div>
          {filtered.length === 0 && <div data-testid="no-results" className={styles.empty}>No transactions match your filters.</div>}
          {filtered.map((tx,i) => (
            <div key={tx.id} data-testid={`history-row-${tx.id}`} className={styles.tableRow}
              style={{borderBottom:i<filtered.length-1?'1px solid var(--border)':'none'}}>
              <div className={styles.txInfo}>
                <div className={styles.txType}><span>{tx.type==='receive'?'↙':'↗'}</span><span data-testid={`tx-type-${tx.id}`} style={{fontWeight:600,fontSize:13,textTransform:'capitalize'}}>{tx.type}</span></div>
                <div data-testid={`tx-id-${tx.id}`}   className={`${styles.txSmall} mono`}>{tx.id}</div>
                <div className={styles.txSmall}>{new Date(tx.date).toLocaleString()}</div>
                {tx.note && <div className={styles.txNote}>{tx.note}</div>}
              </div>
              <div data-testid={`tx-asset-${tx.id}`}  style={{fontWeight:600}}>{tx.asset}</div>
              <div data-testid={`tx-amount-${tx.id}`} className="mono" style={{fontSize:13,fontWeight:600,color:tx.type==='receive'?'var(--green)':'var(--text)'}}>
                {tx.type==='receive'?'+':'-'}{fmt(tx.amount)}
              </div>
              <div data-testid={`tx-usd-${tx.id}`}    style={{fontSize:13}}>{fmtUSD(tx.usdValue)}</div>
              <div><Badge status={tx.status} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
