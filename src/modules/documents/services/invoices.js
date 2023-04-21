import {
  safeEncodeData,
  safeEncodeJsonBody,
  sanitizeParams,
  sendRequest,
} from '@/utils/request';

export const PAYMENT_TYPES = Object.values({
  CASH: 'cash',
  CHECK: 'check',
  CREDIT_CARD: 'cc',
  BANK_TRANSFER: 'bankTransfer',
  ONLINE: 'online',
  MOBILE: 'mobile',
  AUTO: 'auto',
});

export const DEFAULT_INVOICE_ITEM = {
  name: null,
  tax: 0,
  quantity: 1,
  discount: 0,
  net: 0,
  price: 0,
  gross: 0,
};

export const list = (params) => sendRequest(['documents/invoices', safeEncodeData(sanitizeParams(safeEncodeJsonBody(params)))].join('?'));

export const create = (data) => sendRequest('documents/invoices', 'POST', safeEncodeJsonBody(sanitizeParams(data)));

export const show = (id) => sendRequest(`documents/invoices/${id}`);

export const update = (id, data) => sendRequest(`documents/invoices/${id}`, 'PATCH', safeEncodeJsonBody(sanitizeParams(data)));

export const remove = (id) => sendRequest(`documents/invoices/${id}`, 'DELETE');

export const generateNumber = () => sendRequest('documents/invoices/generate-number');
