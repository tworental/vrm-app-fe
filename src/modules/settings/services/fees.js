import { mapFormData, sendRequest } from '@/utils/request';

export const CALCULATION_TYPES = Object.freeze({
  FLAT_FEE: 'fixed',
  PERCENTAGE: 'percentage',
});

export const CHARGE_TYPES = Object.freeze({
  SINGLE_CHARGE: 'singleCharge',
  PER_NIGHT: 'perNight',
});

export const TAX_CHARGE_TYPES = Object.freeze({
  SINGLE_CHARGE: 'singleCharge',
  PER_PERSON: 'perPerson',
});

export const FREQUENCIES = Object.freeze({
  PER_STAY: 'perStay',
  PER_NIGHT: 'perNight',
});

export const list = () => sendRequest('fees');

export const show = (id) => sendRequest(`fees/${id}`);

export const create = (data) => sendRequest('fees', 'POST', mapFormData(data));

export const update = (id, data) => sendRequest(`fees/${id}`, 'PATCH', mapFormData(data));

export const remove = (id) => sendRequest(`fees/${id}`, 'DELETE');

export default {
  CALCULATION_TYPES,
  CHARGE_TYPES,
  FREQUENCIES,
  list,
  show,
  create,
  update,
  remove,
};
