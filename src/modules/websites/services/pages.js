import { mapFormData, sendRequest } from '@/utils/request';

export const list = (websiteId) => sendRequest(`websites/${websiteId}/pages`);

export const show = (websiteId, id) => sendRequest(`websites/${websiteId}/pages/${id}`);

export const create = (websiteId, data) => sendRequest(`websites/${websiteId}/pages`, 'POST', data);

export const update = (websiteId, id, data) => sendRequest(`websites/${websiteId}/pages/${id}`, 'PATCH', mapFormData(data));

export const remove = (websiteId, id) => sendRequest(`websites/${websiteId}/pages/${id}`, 'DELETE');
