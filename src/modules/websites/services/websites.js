import { mapFormData, sendRequest } from '@/utils/request';

export const list = () => sendRequest('websites');

export const show = (id) => sendRequest(`websites/${id}`);

export const create = (data) => sendRequest('websites', 'POST', data);

export const update = (id, data) => sendRequest(`websites/${id}`, 'PATCH', mapFormData(data));

export const remove = (id) => sendRequest(`websites/${id}`, 'DELETE');
