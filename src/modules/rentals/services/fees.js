import { sendRequest } from '@/utils/request';

export const list = (propertyId) => sendRequest(`properties/${propertyId}/fees`);

export const create = (propertyId, data) => sendRequest(`properties/${propertyId}/fees`, 'POST', data);

export const remove = (propertyId, id) => sendRequest(`properties/${propertyId}/fees/${id}`, 'DELETE');
