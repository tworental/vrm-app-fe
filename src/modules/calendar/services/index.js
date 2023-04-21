import {
  safeEncodeData,
  safeEncodeJsonBody,
  sanitizeParams,
  sendRequest,
} from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export const list = (params) => sendRequest(['properties/calendar', safeEncodeData(sanitizeParams(safeEncodeJsonBody(params)))].join('?'));
