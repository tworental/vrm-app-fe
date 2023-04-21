import { safeEncodeData, sendRequest } from '@/utils/request';

export const connect = (settings) => sendRequest('integrations/mailchimp/connect', 'POST', settings);

export const lists = (settings) => sendRequest(['integrations/mailchimp/lists', safeEncodeData(settings)].join('?'), 'GET');
