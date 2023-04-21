import { sendRequest, safeEncodeData, arrayToQuery } from '@/utils/request';

export const list = (params = {}) => sendRequest([
  'storage/folders', safeEncodeData(params),
].join('?'));

export const create = (payload) => sendRequest('storage/folders', 'POST', payload);

export const update = (id, payload) => sendRequest(`storage/folders/${id}`, 'PATCH', payload);

export const remove = (id) => sendRequest(`storage/folders/${id}`, 'DELETE');

export const removeMany = (ids) => sendRequest([
  'storage/folders', safeEncodeData(arrayToQuery(ids, 'ids')),
].join('?'), 'DELETE');

export const removeManyHard = (ids) => sendRequest([
  'storage/folders/delete/hard', safeEncodeData(arrayToQuery(ids, 'ids')),
].join('?'), 'DELETE');
