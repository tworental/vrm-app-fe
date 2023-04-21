import { mapFormData, safeEncodeData, sendRequest } from '@/utils/request';

export const MAX_SINGLE_SIZE = 2 * 1000 * 1000; // 2 MB

export const list = (propertyId, query = {}) => sendRequest([`properties/${propertyId}/images`, safeEncodeData(query)].join('?'));

export const create = (propertyId, data) => sendRequest(`properties/${propertyId}/images`, 'POST', mapFormData(data));

export const update = (propertyId, id, data) => sendRequest(`properties/${propertyId}/images/${id}`, 'PATCH', mapFormData(data));

export const move = (propertyId, id, query = {}, body) => sendRequest([`properties/${propertyId}/images/${id}/move`, safeEncodeData(query)].join('?'), 'PATCH', body);

export const remove = (propertyId, id) => sendRequest(`properties/${propertyId}/images/${id}`, 'DELETE');
