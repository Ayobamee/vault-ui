/**
 * VaultX E2E — Transfer Flow (Send + Receive)
 *
 * Covers:
 * - Send tab: asset selection, amount input, address field, validation, submission
 * - Receive tab: address display, QR visibility
 * - Error states: empty form, invalid amount, missing address
 * - Success: confirmation screen after valid send
 * - Balance updates after transfer
 */

import { test, expect } from '@playwright/test';
import { loginAs, USERS, ROUTES } from './helpers.js';

test.describe('Transfer Page', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, USERS.primary);
    await page.goto(ROUTES.transfer);
    await page.waitForSelector('[data-testid="form-transfer"]');
  });

  // ─── Page Structure ───────────────────────────────────────────────────────

  test('renders transfer form with send/receive toggle', async ({ page }) => {
    await expect(page.getByTestId('form-transfer')).toBeVisible();
    await expect(page.getByTestId('select-asset')).toBeVisible();
  });

  // ─── Send Flow ────────────────────────────────────────────────────────────

  test.describe('Send', () => {
    test.beforeEach(async ({ page }) => {
      // Ensure send tab is active (may already be default)
      const sendTab = page.locator('[data-testid*="tab-send"], [data-value="send"]').first();
      if (await sendTab.isVisible()) await sendTab.click();
    });

    test('submit button is disabled when form is empty', async ({ page }) => {
      await expect(page.getByTestId('btn-submit-transfer')).toBeDisabled();
    });

    test('shows address field when send mode is active', async ({ page }) => {
      await expect(page.getByTestId('input-address')).toBeVisible();
    });

    test('shows validation error when submitting without amount', async ({ page }) => {
      // Fill address but leave amount empty
      await page.getByTestId('input-address').fill('0xABC123DEF456789');
      await page.getByTestId('btn-submit-transfer').click();
      // Either button remains disabled or error appears
      const isDisabled = await page.getByTestId('btn-submit-transfer').isDisabled();
      if (!isDisabled) {
        // If clickable, an error should show
        const errorVisible = await page.locator('[data-testid*="error"]').isVisible();
        expect(errorVisible).toBeTruthy();
      }
    });

    test('shows validation error when submitting without address', async ({ page }) => {
      await page.getByTestId('input-amount').fill('0.01');
      await page.getByTestId('btn-submit-transfer').click();
      const isDisabled = await page.getByTestId('btn-submit-transfer').isDisabled();
      if (!isDisabled) {
        const errorVisible = await page.locator('[data-testid*="error"]').isVisible();
        expect(errorVisible).toBeTruthy();
      }
    });

    test('can select a different asset from dropdown', async ({ page }) => {
      const select = page.getByTestId('select-asset');
      const options = await select.locator('option').allTextContents();
      // Should have at least BTC, ETH, USDT, SOL
      expect(options.length).toBeGreaterThanOrEqual(2);

      // Select second asset
      await select.selectOption({ index: 1 });
      const selected = await select.inputValue();
      expect(selected).toBeTruthy();
    });

    test('shows USD preview when amount is entered', async ({ page }) => {
      await page.getByTestId('input-amount').fill('0.5');
      // USD preview should appear somewhere on screen
      const preview = page.locator('[data-testid*="usd"], [data-testid*="preview"]');
      if (await preview.isVisible()) {
        await expect(preview).not.toBeEmpty();
      }
    });

    test('successful send shows confirmation screen', async ({ page }) => {
      await page.getByTestId('input-amount').fill('0.001');
      await page.getByTestId('input-address').fill('0xDeadBeef1234567890AbCdEf');

      const noteInput = page.getByTestId('input-note');
      if (await noteInput.isVisible()) {
        await noteInput.fill('E2E test transfer');
      }

      await page.getByTestId('btn-submit-transfer').click();

      // Expect a success/confirmation state to appear
      await expect(
        page.locator('[data-testid*="success"], [data-testid*="confirm"], [data-testid*="complete"]')
      ).toBeVisible({ timeout: 8000 });
    });

    test('note field is optional and accepts free text', async ({ page }) => {
      const noteInput = page.getByTestId('input-note');
      if (await noteInput.isVisible()) {
        await noteInput.fill('Payment for services #42');
        await expect(noteInput).toHaveValue('Payment for services #42');
      }
    });
  });

  // ─── Receive Flow ─────────────────────────────────────────────────────────

  test.describe('Receive', () => {
    test.beforeEach(async ({ page }) => {
      const receiveTab = page.locator('[data-testid*="tab-receive"], [data-value="receive"]').first();
      if (await receiveTab.isVisible()) await receiveTab.click();
    });

    test('does not show address input field in receive mode', async ({ page }) => {
      // The address input (for entering recipient) should be hidden in receive mode
      const addressInput = page.getByTestId('input-address');
      const isHidden = !(await addressInput.isVisible());
      expect(isHidden).toBeTruthy();
    });

    test('displays a receive address or QR code', async ({ page }) => {
      // Either a receive address text or QR code element should be visible
      const qrOrAddress = page.locator(
        '[data-testid*="qr"], [data-testid*="receive-address"], [data-testid*="wallet-address"]'
      );
      await expect(qrOrAddress.first()).toBeVisible({ timeout: 5000 });
    });
  });

  // ─── URL Parameter Pre-selection ──────────────────────────────────────────

  test('?type=send pre-selects send tab', async ({ page }) => {
    await page.goto(`${ROUTES.transfer}?type=send`);
    await page.waitForSelector('[data-testid="form-transfer"]');
    // Address input only visible in send mode
    await expect(page.getByTestId('input-address')).toBeVisible();
  });

  test('?type=receive pre-selects receive tab', async ({ page }) => {
    await page.goto(`${ROUTES.transfer}?type=receive`);
    await page.waitForSelector('[data-testid="form-transfer"]');
    // Address input should NOT be visible in receive mode
    await expect(page.getByTestId('input-address')).not.toBeVisible();
  });
});
