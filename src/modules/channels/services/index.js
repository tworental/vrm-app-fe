import { sendRequest } from '@/utils/request';

export const list = () => sendRequest('channel-managers');

export const update = (id, data) => sendRequest(`channel-managers/${id}`, 'PATCH', data);
