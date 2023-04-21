import {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER, safeEncodeData, safeEncodeJsonBody,
  sanitizeParams,
  sendRequest,
} from '@/utils/request';

export const SORT_DEFAULTS = Object.freeze({
  key: DEFAULT_SORT_KEY,
  order: DEFAULT_SORT_ORDER,
});

export const TITLES = Object.freeze({
  MR: 'mr',
  MS: 'ms',
  MRS: 'mrs',
  MISS: 'miss',
  MX: 'mx',
});

export const TYPES = Object.freeze({
  PRIVATE: 'private',
  BUSINESS: 'business',
});

export const VAT_TYPES = Object.freeze({
  LOCAL_VAT: 'localVat',
  ZERO_VAT: 'zeroVat',
});

export const list = (params) => sendRequest(['guests', safeEncodeData(sanitizeParams(safeEncodeJsonBody(params)))].join('?'));

export const create = (data) => sendRequest('guests', 'POST', sanitizeParams(safeEncodeJsonBody(sanitizeParams(data))));

export const update = (id, data) => sendRequest(`guests/${id}`, 'PATCH', sanitizeParams(safeEncodeJsonBody(sanitizeParams(data))));

export const show = (id) => sendRequest(`guests/${id}`);

export const remove = (id) => sendRequest(`guests/${id}`, 'DELETE');
