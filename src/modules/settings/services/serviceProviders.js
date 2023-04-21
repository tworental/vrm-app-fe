import { mapFormData, sendRequest } from '@/utils/request';

export const list = () => sendRequest('service-providers');

export const show = (id) => sendRequest(`service-providers/${id}`);

export const create = (data) => sendRequest('service-providers', 'POST', mapFormData(data));

export const update = (id, data) => sendRequest(`service-providers/${id}`, 'PATCH', mapFormData(data));

export const remove = (id) => sendRequest(`service-providers/${id}`, 'DELETE');
