import { sendRequest } from '@/utils/request';

export const list = () => sendRequest('rate-seasons');

export const show = (id) => sendRequest(`rate-seasons/${id}`);

export const create = (data) => sendRequest('rate-seasons', 'POST', data);

export const update = (id, data) => sendRequest(`rate-seasons/${id}`, 'PATCH', data);

export const remove = (id) => sendRequest(`rate-seasons/${id}`, 'DELETE');
