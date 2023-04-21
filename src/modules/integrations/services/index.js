import { sendRequest } from '@/utils/request';

export const getIntegrations = () => sendRequest('integrations');

export const getAttachedIntegration = (id) => sendRequest(`integrations/${id}/attached`);

export const setAttachedIntegration = (id, data) => sendRequest(`integrations/${id}/attached`, 'POST', data);
