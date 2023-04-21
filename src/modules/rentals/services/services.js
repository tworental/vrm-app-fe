import { sendRequest } from '@/utils/request';

export const list = (propertyId) => sendRequest(`properties/${propertyId}/services`);

export const create = (propertyId, data) => sendRequest(`properties/${propertyId}/services`, 'POST', data);

export const remove = (propertyId, id) => sendRequest(`properties/${propertyId}/services/${id}`, 'DELETE');
