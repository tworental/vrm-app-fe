import { Calendar, Timepicker, Popup } from 'dhx-suite';
import { MEASURING_UNITS } from '@/modules/account/services';

const WEEK_START = Object.freeze({
  [MEASURING_UNITS.IMPERIAL]: 'sunday',
  [MEASURING_UNITS.METRIC]: 'monday',
});

export const createCalendar = (options, measuringUnit) => new Calendar(null, {
  css: 'dhx_widget--bordered',
  dateFormat: '%Y-%m-%d',
  weekStart: WEEK_START[measuringUnit],
  ...options,
});

export const createPopupAndAttach = (attachElement) => {
  const popup = new Popup();
  popup.attach(attachElement);

  return popup;
};

export const createTimepicker = (options) => new Timepicker(null, {
  css: 'dhx_widget--bordered',
  ...options,
});
