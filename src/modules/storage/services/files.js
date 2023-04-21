import {
  sendRequest,
  safeEncodeData,
  arrayToQuery,
  mapFormData,
  sendRequestWithProgressTracking,
} from '@/utils/request';

export const list = (params = {}) => sendRequest([
  'storage/files', safeEncodeData(params),
].join('?'));

export const create = (payload, onProgress) => sendRequestWithProgressTracking('storage/files', 'POST', mapFormData(payload), { onProgress });

export const update = (id, payload) => sendRequest(`storage/files/${id}`, 'PATCH', payload);

export const remove = (id) => sendRequest(`storage/files/${id}`, 'DELETE');

export const removeMany = (ids) => sendRequest([
  'storage/files', safeEncodeData(arrayToQuery(ids, 'ids')),
].join('?'), 'DELETE');

export const removeManyHard = (ids) => sendRequest([
  'storage/files/delete/hard', safeEncodeData(arrayToQuery(ids, 'ids')),
].join('?'), 'DELETE');
