import { sanitizeParams, sendRequest } from '@/utils/request';

export const list = (bookingId) => sendRequest(`bookings/${bookingId}/guests`);

export const create = (bookingId, data) => sendRequest(`bookings/${bookingId}/guests`, 'POST', sanitizeParams(data));

export const update = (bookingId, id, data) => sendRequest(`bookings/${bookingId}/guests/${id}`, 'PATCH', sanitizeParams(data));

export const show = (bookingId, id) => sendRequest(`bookings/${bookingId}/guests/${id}`);

export const remove = (bookingId, id) => sendRequest(`bookings/${bookingId}/guests/${id}`, 'DELETE');
