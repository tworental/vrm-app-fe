import { mapFormData, sendRequest } from '@/utils/request';

export const list = () => sendRequest('customer-contacts');

export const show = (id) => sendRequest(`customer-contacts/${id}`);

export const create = (data) => sendRequest('customer-contacts', 'POST', mapFormData(data));

export const update = (id, data) => sendRequest(`customer-contacts/${id}`, 'PATCH', mapFormData(data));

export const remove = (id) => sendRequest(`customer-contacts/${id}`, 'DELETE');
