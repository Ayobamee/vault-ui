# ⬡ VaultX — Fintech QA Playground

A realistic crypto wallet web app built for **Playwright QA training**. Covers auth (login + 2FA), dashboard, fund transfers, and transaction history — all wired with `data-testid` attributes throughout.

---

## 📄 Documentation

| Document | Location | Description |
|----------|----------|-------------|
| **Product Requirements Document** | [`docs/VaultX-PRD.docx`](./docs/VaultX-PRD.docx) | Full PRD with acceptance criteria, data-testid reference, JIRA structure, and Playwright quick-start |
| API README | [`vaultx-api/README.md`](../vaultx-api/README.md) | REST endpoint reference, WebSocket events, deploy guide |

> **Start here if you're a QA intern** — read the PRD before writing any test cases.

---

## 🚀 Quick Start

```bash
npm install
npm run dev       # → http://localhost:3000
npm run build     # production build
npm run preview   # preview production build locally
```

> The API must also be running for live sync to work. See the [API repo](../vaultx-api) for setup.

---

## 🧪 Test Credentials

| Email | Password | 2FA Code |
|-------|----------|----------|
| `qa@vaultx.io` | `Test@1234` | `482910` |
| `intern@vaultx.io` | `Intern@99` | `773421` |

---

## 🗺️ App Routes

| Route | Screen | Auth Required |
|-------|--------|---------------|
| `/login` | Login + 2FA | ❌ |
| `/dashboard` | Portfolio, wallets, recent activity | ✅ |
| `/transfer` | Send / Receive | ✅ |
| `/transfer?type=send` | Send pre-selected | ✅ |
| `/transfer?type=receive` | Receive pre-selected | ✅ |
| `/history` | Transaction history + filters | ✅ |

---

## 🌐 Deploy

### Vercel
```bash
npm i -g vercel
vercel        # staging preview
vercel --prod # production
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --build          # draft
netlify deploy --build --prod   # production
```

The `vercel.json` and `netlify.toml` files handle SPA routing automatically.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and set:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000

# Production
# VITE_API_URL=https://your-vaultx-api.onrender.com
# VITE_WS_URL=wss://your-vaultx-api.onrender.com
```

---

## 📁 Project Structure

```
vaultx/
├── docs/
│   └── VaultX-PRD.docx         ← Product Requirements Document
├── public/
├── src/
│   ├── api/
│   │   └── client.js            ← REST helpers + WebSocket manager
│   ├── components/
│   │   ├── Dashboard.jsx / .module.css
│   │   ├── History.jsx   / .module.css
│   │   ├── Login.jsx     / .module.css
│   │   ├── Transfer.jsx  / .module.css
│   │   └── UI.jsx        / .module.css   ← Toast, Spinner, Badge, NavBar, StatusPill
│   ├── data/
│   │   └── seed.js              ← fallback seed users, wallets, transactions
│   ├── hooks/
│   │   └── useAppState.js       ← app state + WebSocket event handlers
│   ├── App.jsx                  ← routing + auth guard
│   ├── main.jsx                 ← entry point
│   └── index.css                ← global styles + CSS variables (#2B586B theme)
├── index.html
├── vite.config.js
├── vercel.json
├── netlify.toml
└── .env.example
```
