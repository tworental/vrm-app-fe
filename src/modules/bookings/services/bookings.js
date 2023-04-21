import {
  safeEncodeData,
  safeEncodeJsonBody,
  sanitizeParams,
  sendRequest,
} from '@/utils/request';

export const list = (params) => sendRequest(['bookings', safeEncodeData(sanitizeParams(safeEncodeJsonBody(params)))].join('?'));

export const create = (data) => sendRequest('bookings', 'POST', sanitizeParams(data));

export const update = (id, data) => sendRequest(`bookings/${id}`, 'PATCH', sanitizeParams(data));

export const show = (id) => sendRequest(`bookings/${id}`);

export const remove = (id) => sendRequest(`bookings/${id}`, 'DELETE');

export const checkAvailability = (params) => sendRequest(['bookings/availability', safeEncodeData(sanitizeParams(params))].join('?'));

export default {
  list,
  create,
  update,
  show,
  remove,
  checkAvailability,
};
