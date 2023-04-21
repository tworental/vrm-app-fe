import { sendRequest } from '@/utils/request';

export const TIMING_TYPES = Object.freeze({
  EXACT_TIME: 'time',
  ALL_STAY: 'stay',
});

export const PERIOD_TYPES = Object.freeze({
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
});

export const NOTIFICATION_TIME_TYPES = Object.freeze({
  BEFORE_CHECK_OUT: 'beforeCheckOut',
  AFTER_CHECK_OUT: 'afterCheckOut',
  BEFORE_CHECK_IN: 'beforeCheckIn',
  AFTER_CHECK_IN: 'afterCheckIn',
  BEFORE_SERVICE: 'beforeService',
});

export const list = () => sendRequest('services');

export const show = (id) => sendRequest(`services/${id}`);

export const create = (data) => sendRequest('services', 'POST', data);

export const update = (id, data) => sendRequest(`services/${id}`, 'PATCH', data);

export const remove = (id) => sendRequest(`services/${id}`, 'DELETE');
