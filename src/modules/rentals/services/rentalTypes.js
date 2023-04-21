import { sanitizeParams, sendRequest } from '@/utils/request';

export const list = (id) => sendRequest(`properties/${id}/unit-types`);

export const show = (propertyId, id) => sendRequest(`properties/${propertyId}/unit-types/${id}`);

export const create = (propertyId, data) => sendRequest(`properties/${propertyId}/unit-types`, 'POST', data);

export const update = (propertyId, id, data) => sendRequest(`properties/${propertyId}/unit-types/${id}`, 'PATCH', sanitizeParams(data));

export const remove = (propertyId, id) => sendRequest(`properties/${propertyId}/unit-types/${id}`, 'DELETE');
