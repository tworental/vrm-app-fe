import { sendRequest } from '@/utils/request';

export const list = (propertyId) => sendRequest(`properties/${propertyId}/taxes`);

export const create = (propertyId, data) => sendRequest(`properties/${propertyId}/taxes`, 'POST', data);

export const remove = (propertyId, id) => sendRequest(`properties/${propertyId}/taxes/${id}`, 'DELETE');
