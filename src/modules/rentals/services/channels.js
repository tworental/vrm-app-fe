import { sendRequest } from '@/utils/request';

export const list = (propertyId) => sendRequest(`properties/${propertyId}/channels`);

export const update = (propertyId, id, data) => sendRequest(`properties/${propertyId}/channels/${id}`, 'PATCH', data);

export const sync = (propertyId, id) => sendRequest(`properties/${propertyId}/channels/${id}/sync`, 'POST');
