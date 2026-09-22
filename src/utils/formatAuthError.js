/**
 * Maps HTTP status codes / error types to user-friendly messages.
 * Pure function — deterministic, no side effects.
 * @param {number | string} code
 * @returns {string}
 */
export function formatAuthError(code) {
  const messages = {
    400: 'Invalid request. Please check your details.',
    401: 'Invalid credentials. Please try again.',
    403: 'Access denied.',
    404: 'Account not found.',
    429: 'Too many attempts. Please wait before trying again.',
    500: 'Server error. Please try again later.',
    'network': 'Network error. Check your connection.',
    'invalid_otp': 'Invalid verification code. Please try again.',
    'expired_otp': 'Verification code has expired. Request a new one.',
    'account_locked': 'Account locked due to too many failed attempts.',
  }

  return messages[code] ?? 'Something went wrong. Please try again.'
}
