/**
 * VaultX E2E — Login + 2FA Flow
 *
 * Covers:
 * - Happy path: valid credentials → 2FA → dashboard
 * - Error states: wrong email, wrong password, wrong OTP
 * - 2FA UX: digit-by-digit input, auto-focus, back button
 * - Auth guard: unauthenticated redirect to /login
 */

import { test, expect } from '@playwright/test';
import { loginAs, USERS, ROUTES } from './helpers.js';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.login);
  });

  test('renders all login form elements', async ({ page }) => {
    await expect(page.getByTestId('screen-login')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('btn-login')).toBeVisible();
    await expect(page.getByTestId('btn-login')).toBeEnabled();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByTestId('input-email').fill('wrong@email.com');
    await page.getByTestId('input-password').fill('WrongPass!1');
    await page.getByTestId('btn-login').click();

    const error = page.getByTestId('error-login');
    await expect(error).toBeVisible();
    await expect(error).not.toBeEmpty();
  });

  test('shows error on correct email but wrong password', async ({ page }) => {
    await page.getByTestId('input-email').fill(USERS.primary.email);
    await page.getByTestId('input-password').fill('WrongPass!999');
    await page.getByTestId('btn-login').click();

    await expect(page.getByTestId('error-login')).toBeVisible();
  });

  test('does not show error on initial load', async ({ page }) => {
    await expect(page.getByTestId('error-login')).not.toBeVisible();
  });

  test('navigates to 2FA screen with valid credentials', async ({ page }) => {
    await page.getByTestId('input-email').fill(USERS.primary.email);
    await page.getByTestId('input-password').fill(USERS.primary.password);
    await page.getByTestId('btn-login').click();

    await expect(page.getByTestId('screen-2fa')).toBeVisible();
    // Should not have navigated away yet
    await expect(page).not.toHaveURL('**/dashboard');
  });
});

test.describe('2FA Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Get to 2FA screen
    await page.goto(ROUTES.login);
    await page.getByTestId('input-email').fill(USERS.primary.email);
    await page.getByTestId('input-password').fill(USERS.primary.password);
    await page.getByTestId('btn-login').click();
    await page.waitForSelector('[data-testid="screen-2fa"]');
  });

  test('renders 6 OTP input boxes', async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      await expect(page.getByTestId(`otp-input-${i}`)).toBeVisible();
    }
  });

  test('verify button is disabled when OTP is incomplete', async ({ page }) => {
    await expect(page.getByTestId('btn-verify-2fa')).toBeDisabled();

    // Fill only 3 digits
    for (let i = 0; i < 3; i++) {
      await page.getByTestId(`otp-input-${i}`).fill(USERS.primary.otp[i]);
    }
    await expect(page.getByTestId('btn-verify-2fa')).toBeDisabled();
  });

  test('verify button is enabled when all 6 digits are filled', async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      await page.getByTestId(`otp-input-${i}`).fill(USERS.primary.otp[i]);
    }
    await expect(page.getByTestId('btn-verify-2fa')).toBeEnabled();
  });

  test('shows error on wrong OTP code', async ({ page }) => {
    const wrongOtp = '000000';
    for (let i = 0; i < 6; i++) {
      await page.getByTestId(`otp-input-${i}`).fill(wrongOtp[i]);
    }
    await page.getByTestId('btn-verify-2fa').click();

    await expect(page.getByTestId('error-2fa')).toBeVisible();
    await expect(page.getByTestId('error-2fa')).not.toBeEmpty();
  });

  test('back button returns to login screen', async ({ page }) => {
    await page.getByTestId('btn-back-login').click();
    await expect(page.getByTestId('screen-login')).toBeVisible();
  });

  test('successful OTP redirects to dashboard', async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      await page.getByTestId(`otp-input-${i}`).fill(USERS.primary.otp[i]);
    }
    await page.getByTestId('btn-verify-2fa').click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('screen-dashboard')).toBeVisible();
  });
});

test.describe('Auth Guard', () => {
  test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto(ROUTES.dashboard);
    await expect(page).toHaveURL(/.*login/);
  });

  test('redirects unauthenticated user from /transfer to /login', async ({ page }) => {
    await page.goto(ROUTES.transfer);
    await expect(page).toHaveURL(/.*login/);
  });

  test('redirects unauthenticated user from /history to /login', async ({ page }) => {
    await page.goto(ROUTES.history);
    await expect(page).toHaveURL(/.*login/);
  });

  test('logout button returns user to /login', async ({ page }) => {
    await loginAs(page, USERS.primary);
    await page.getByTestId('btn-logout').click();
    await expect(page).toHaveURL(/.*login/);
  });
});
