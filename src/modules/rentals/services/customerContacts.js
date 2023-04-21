import { sendRequest } from '@/utils/request';

export const list = (propertyId) => sendRequest(`properties/${propertyId}/customer-contacts`);

export const create = (propertyId, data) => sendRequest(`properties/${propertyId}/customer-contacts`, 'POST', data);

export const remove = (propertyId, id) => sendRequest(`properties/${propertyId}/customer-contacts/${id}`, 'DELETE');
