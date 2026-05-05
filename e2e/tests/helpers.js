/**
 * VaultX E2E Test Helpers
 * Shared utilities, credentials, and page actions used across test files.
 */

export const USERS = {
  primary: {
    email: 'qa@vaultx.io',
    password: 'Test@1234',
    otp: '482910',
    name: 'QA Engineer',
  },
  intern: {
    email: 'intern@vaultx.io',
    password: 'Intern@99',
    otp: '773421',
    name: 'Intern',
  },
};

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  transfer: '/transfer',
  history: '/history',
};

/**
 * Completes the full login + 2FA flow and lands on /dashboard.
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string, otp: string }} user
 */
export async function loginAs(page, user = USERS.primary) {
  await page.goto(ROUTES.login);
  await page.getByTestId('input-email').fill(user.email);
  await page.getByTestId('input-password').fill(user.password);
  await page.getByTestId('btn-login').click();

  // Wait for 2FA screen
  await page.waitForSelector('[data-testid="screen-2fa"]');

  // Fill OTP digit by digit
  for (let i = 0; i < 6; i++) {
    await page.getByTestId(`otp-input-${i}`).fill(user.otp[i]);
  }

  await page.getByTestId('btn-verify-2fa').click();
  await page.waitForURL('**/dashboard');
}
