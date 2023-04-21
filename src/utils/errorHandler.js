const CODES = Object.freeze({
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_UNCONFIRMED: 'ACCOUNT_UNCONFIRMED',
  PHONE_NUMBER_UNVERIFIED: 'PHONE_NUMBER_UNVERIFIED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  REQUEST_FAIL: 'REQUEST_FAIL',
});

export default function errorHandler(err) {
  switch (err.status) {
    case 401:
      return { name: 'signout' };
    case 402:
      return { name: 'billing-overview' };
    case 403:
    case 404:
      return { name: `error-${err.status}` };
    case 422:
      if (err.code === CODES.PHONE_NUMBER_UNVERIFIED) {
        return { name: 'verification-phone' };
      }
      return null;
    default:
      if (err.message === 'Failed to fetch') {
        return { name: 'error-502' };
      }
      return { name: 'error-500' };
  }
}
