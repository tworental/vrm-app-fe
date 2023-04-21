import { sanitizeParams, sendRequest } from '@/utils/request';

export const PAYMENT_TYPES = Object.freeze({
  CASH: 'cash',
  CREDIT_CARD: 'cc',
  BANK_TRANSFER: 'bankTransfer',
  ONLINE: 'online',
  MOBILE: 'mobile',
  OTHER: 'other',
});

export const list = (bookingId) => sendRequest(`bookings/${bookingId}/payments`);

export const create = (bookingId, data) => sendRequest(`bookings/${bookingId}/payments`, 'POST', sanitizeParams(data));

export const update = (bookingId, id, data) => sendRequest(`bookings/${bookingId}/payments/${id}`, 'PATCH', data);

export const show = (bookingId, id) => sendRequest(`bookings/${bookingId}/payments/${id}`);

export const remove = (bookingId, id) => sendRequest(`bookings/${bookingId}/payments/${id}`, 'DELETE');
