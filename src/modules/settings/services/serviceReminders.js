import { sendRequest } from '@/utils/request';

export const list = (serviceId) => sendRequest(`services/${serviceId}/reminders`);

export const show = (serviceId, id) => sendRequest(`services/${serviceId}/reminders/${id}`);

export const create = (serviceId, data) => sendRequest(`services/${serviceId}/reminders`, 'POST', data);

export const update = (serviceId, id, data) => sendRequest(`services/${serviceId}/reminders/${id}`, 'PATCH', data);

export const remove = (serviceId, id) => sendRequest(`services/${serviceId}/reminders/${id}`, 'DELETE');
