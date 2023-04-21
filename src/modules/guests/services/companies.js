import {
  safeEncodeJsonBody,
  sanitizeParams,
  sendRequest,
} from '@/utils/request';

export const COMPANY_TYPES = Object.freeze({
  COMPANY: 'company',
  AGENCY: 'agency',
});

export const list = () => sendRequest('companies');

export const create = (data) => sendRequest('companies', 'POST', sanitizeParams(safeEncodeJsonBody(sanitizeParams(data))));

export const update = (id, data) => sendRequest(`companies/${id}`, 'PATCH', sanitizeParams(safeEncodeJsonBody(sanitizeParams(data))));

export const show = (id) => sendRequest(`companies/${id}`);

export const remove = (id) => sendRequest(`companies/${id}`, 'DELETE');
