export const USERS = [
  { id: 'user_001', email: 'qa@vaultx.io', password: 'Test@1234', name: 'Jordan Okafor', avatar: 'JO', twoFACode: '482910', role: 'QA Engineer' },
  { id: 'user_002', email: 'intern@vaultx.io', password: 'Intern@99', name: 'Priya Nair', avatar: 'PN', twoFACode: '773421', role: 'QA Intern' },
]

export const INITIAL_WALLETS = [
  { id: 'w1', userId: 'user_001', symbol: 'BTC',  name: 'Bitcoin',  balance: 0.84231, usdRate: 62480, color: '#F7931A', icon: '₿', address: '1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUvWx' },
  { id: 'w2', userId: 'user_001', symbol: 'ETH',  name: 'Ethereum', balance: 4.2091,  usdRate: 3105,  color: '#627EEA', icon: 'Ξ', address: '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12' },
  { id: 'w3', userId: 'user_001', symbol: 'USDT', name: 'Tether',   balance: 2450.0,  usdRate: 1,     color: '#26A17B', icon: '₮', address: 'TUSDTxxxABCDEF1234567890ABCDEF12345678' },
  { id: 'w4', userId: 'user_001', symbol: 'SOL',  name: 'Solana',   balance: 18.55,   usdRate: 148,   color: '#9945FF', icon: '◎', address: 'SoLANAxyz1234567890ABCDEF1234567890AB' },
]

export const INITIAL_TRANSACTIONS = [
  { id: 'tx001', userId: 'user_001', type: 'receive', asset: 'BTC',  amount: 0.12,  usdValue: 7497.6,  from: '0xA1B2...C3D4',  to: 'My Wallet', date: '2025-04-10T14:23:00Z', status: 'completed', note: 'Client payment' },
  { id: 'tx002', userId: 'user_001', type: 'send',    asset: 'ETH',  amount: 1.5,   usdValue: 4657.5,  from: 'My Wallet',      to: '0xF9E8...D7C6', date: '2025-04-09T09:11:00Z', status: 'completed', note: 'NFT purchase' },
  { id: 'tx003', userId: 'user_001', type: 'send',    asset: 'USDT', amount: 500,   usdValue: 500,     from: 'My Wallet',      to: '0x1234...5678', date: '2025-04-08T17:45:00Z', status: 'pending',   note: 'Freelance payment' },
  { id: 'tx004', userId: 'user_001', type: 'receive', asset: 'SOL',  amount: 5,     usdValue: 740,     from: '0xBEEF...CAFE',  to: 'My Wallet', date: '2025-04-07T11:00:00Z', status: 'completed', note: '' },
  { id: 'tx005', userId: 'user_001', type: 'send',    asset: 'BTC',  amount: 0.03,  usdValue: 1874.4,  from: 'My Wallet',      to: '0xDEAD...BEEF', date: '2025-04-06T08:30:00Z', status: 'failed',    note: 'Gas too low' },
  { id: 'tx006', userId: 'user_001', type: 'receive', asset: 'ETH',  amount: 0.75,  usdValue: 2328.75, from: '0x9988...7766',  to: 'My Wallet', date: '2025-04-05T20:15:00Z', status: 'completed', note: 'Staking reward' },
  { id: 'tx007', userId: 'user_001', type: 'send',    asset: 'USDT', amount: 1200,  usdValue: 1200,    from: 'My Wallet',      to: '0x5544...3322', date: '2025-04-04T13:22:00Z', status: 'completed', note: 'Rent' },
  { id: 'tx008', userId: 'user_001', type: 'receive', asset: 'BTC',  amount: 0.05,  usdValue: 3124,    from: '0xAABB...CCDD',  to: 'My Wallet', date: '2025-04-03T16:55:00Z', status: 'completed', note: '' },
]
