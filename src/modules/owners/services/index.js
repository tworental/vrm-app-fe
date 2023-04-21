import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  sendRequest,
  sanitizeParams,
} from '@/utils/request';

export const SORT_DEFAULTS = Object.freeze({
  key: DEFAULT_SORT_KEY,
  order: DEFAULT_SORT_ORDER,
});

export const list = () => sendRequest('owners');

export const create = (data) => sendRequest('owners', 'POST', sanitizeParams(data));

export const update = (id, data) => sendRequest(`owners/${id}`, 'PATCH', sanitizeParams(data));

export const show = (id) => sendRequest(`owners/${id}`);

export const remove = (id) => sendRequest(`owners/${id}`, 'DELETE');

export const changeLockedState = (id, state) => sendRequest(`owners/${id}/${state}`, 'POST');

export const sendEmailConfirmation = (id) => sendRequest(`owners/${id}/invite`, 'POST');
