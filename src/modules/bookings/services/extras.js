import { sanitizeParams, sendRequest } from '@/utils/request';

export const EXTRAS_TYPES = Object.freeze({
  TAX: 'tax',
  FEE: 'fee',
  SERVICE: 'service',
});

export const DEFAULT_NIGHTS = 1;

export const list = (bookingId) => sendRequest(`bookings/${bookingId}/extras`);

export const create = (bookingId, data) => sendRequest(`bookings/${bookingId}/extras`, 'POST', sanitizeParams(data));

export const show = (bookingId, id) => sendRequest(`bookings/${bookingId}/extras/${id}`);

export const update = (bookingId, id, data) => sendRequest(`bookings/${bookingId}/extras/${id}`, 'PATCH', data);

export const remove = (bookingId, id) => sendRequest(`bookings/${bookingId}/extras/${id}`, 'DELETE');
