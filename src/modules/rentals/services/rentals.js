import { sendRequest } from '@/utils/request';

export const list = () => sendRequest('properties');

export const show = (id) => sendRequest(`properties/${id}`);

export const create = (data) => sendRequest('properties', 'POST', data);

export const update = (id, data) => sendRequest(`properties/${id}`, 'PATCH', data);

export const remove = (id) => sendRequest(`properties/${id}`, 'DELETE');
