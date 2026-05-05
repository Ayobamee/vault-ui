# VaultX E2E Tests

Playwright test suite for [vault-ui-zeta.vercel.app](https://vault-ui-zeta.vercel.app).

## Setup

```bash
npm install
npx playwright install --with-deps chromium firefox
```

## Running Tests

| Command | What it does |
|---|---|
| `npm test` | All tests, headless |
| `npm run test:ui` | Playwright UI mode (interactive) |
| `npm run test:headed` | Runs with visible browser |
| `npm run test:debug` | Step-through debugger |
| `npm run test:auth` | Auth tests only |
| `npm run test:transfer` | Transfer tests only |
| `npm run test:history` | History tests only |
| `npm run report` | Open last HTML report |

## Test Credentials

| Email | Password | OTP |
|---|---|---|
| `qa@vaultx.io` | `Test@1234` | `482910` |
| `intern@vaultx.io` | `Intern@99` | `773421` |

## Project Structure

```
vaultx-e2e/
├── playwright.config.js   # Config: baseURL, browsers, retries
├── tests/
│   ├── helpers.js         # Shared loginAs(), USERS, ROUTES
│   ├── auth.spec.js       # Login, 2FA, auth guard, logout
│   ├── transfer.spec.js   # Send flow, receive flow, validation
│   └── history.spec.js    # Search, filters, sort, empty state
└── package.json
```

## Test Coverage

### `auth.spec.js` (14 tests)
- Login form renders correctly
- Error on invalid credentials
- Error on wrong email / wrong password
- No error on initial load
- Navigates to 2FA on valid credentials
- 6 OTP inputs render
- Verify button disabled when OTP incomplete
- Verify button enabled when all 6 digits filled
- Error on wrong OTP
- Back button returns to login
- Successful OTP redirects to /dashboard
- Auth guard: /dashboard, /transfer, /history redirect to /login
- Logout returns to /login

### `transfer.spec.js` (11 tests)
- Transfer form renders
- Submit disabled when empty
- Address field visible in send mode
- Validation error: no amount
- Validation error: no address
- Asset selector works + has multiple options
- USD preview appears on amount entry
- Successful send shows confirmation screen
- Optional note field accepts text
- Receive mode hides address input
- Receive mode shows address/QR
- `?type=send` pre-selects send tab
- `?type=receive` pre-selects receive tab

### `history.spec.js` (16 tests)
- Rows render on load
- Summary stats visible
- Search is visible + interactive
- Search for known asset filters rows
- Search for gibberish shows empty state
- Clearing search restores full list
- Type filter visible
- Filter by "send" reduces list
- Filter by "receive" works
- Resetting type filter restores full list
- Status filter visible
- Filter by "completed" works
- Filter by "pending" works
- Sort control visible
- Changing sort reorders list
- Combined type + status filter
- Search + filter combination

## Tips for Interns

- Start with `test:ui` — it gives you a visual runner where you can click tests one at a time
- Use `test:debug` to step through a failing test line by line
- Check `test-results/` after a run for screenshots and videos of failures
- `data-testid` selectors are your best friend — always prefer them over CSS selectors or text
