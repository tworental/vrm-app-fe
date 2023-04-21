import { DEFAULT_SORT_KEY, DEFAULT_SORT_ORDER, sendRequest } from '@/utils/request';

export const SORT_DEFAULTS = Object.freeze({
  key: DEFAULT_SORT_KEY,
  order: DEFAULT_SORT_ORDER,
});

export const list = () => sendRequest('users');

export const create = (data) => sendRequest('users', 'POST', data);

export const update = (id, data) => sendRequest(`users/${id}`, 'PATCH', data);

export const show = (id) => sendRequest(`users/${id}`);

export const remove = (id) => sendRequest(`users/${id}`, 'DELETE');

export const permissions = () => sendRequest('permissions');

export const changeLockedState = (id, state) => sendRequest(`users/${id}/${state}`, 'POST');

export const sendEmailConfirmation = (id) => sendRequest(`users/${id}/invite`, 'POST');
