import { sendRequest, safeEncodeData, getHeaders } from '@/utils/request';

export const signinRequest = (data) => sendRequest(
  'auth/signin', 'POST', data,
);

export const changePasswordRequest = (data, query) => sendRequest(
  ['auth/password/change', safeEncodeData(query)].join('?'), 'PATCH', data,
);

export const resetPasswordRequest = (data) => sendRequest(
  'auth/password/reset', 'POST', data,
);

export const confirmationRequest = (query) => sendRequest(
  ['auth/account/verification/email/confirm', safeEncodeData(query)].join('?'), 'PATCH',
);

export const validateRequest = (field, data) => sendRequest(
  `auth/validate?field=${field}`, 'POST', { identifier: getHeaders('X-Org-Id'), ...data },
);

export const phoneVerificationRequest = (data) => sendRequest('auth/account/verification/phone/request', 'POST', data);

export const phoneVerificationConfirm = (data) => sendRequest('auth/account/verification/phone/confirm', 'PATCH', data);

export const googleAuthRequest = () => sendRequest('auth/oauth/google/request', 'POST');

export const signoutRequest = () => sendRequest('auth/signout', 'DELETE');
