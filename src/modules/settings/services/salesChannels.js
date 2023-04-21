import { mapFormData, sendRequest } from '@/utils/request';

export const list = () => sendRequest('sales-channels');

export const show = (id) => sendRequest(`sales-channels/${id}`);

export const create = (data) => sendRequest('sales-channels', 'POST', mapFormData(data));

export const update = (id, data) => sendRequest(`sales-channels/${id}`, 'PATCH', mapFormData(data));

export const remove = (id) => sendRequest(`sales-channels/${id}`, 'DELETE');
