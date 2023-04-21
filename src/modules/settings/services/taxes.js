import { mapFormData, sendRequest } from '@/utils/request';

export const list = () => sendRequest('taxes');

export const show = (id) => sendRequest(`taxes/${id}`);

export const create = (data) => sendRequest('taxes', 'POST', mapFormData(data));

export const update = (id, data) => sendRequest(`taxes/${id}`, 'PATCH', mapFormData(data));

export const remove = (id) => sendRequest(`taxes/${id}`, 'DELETE');

export default {
  list,
  show,
  create,
  update,
  remove,
};
