const BOOKING_TYPE_MODE_KEY = 'tworentals:bookingMode';

export const BOOKING_VIEW_MODES = Object.freeze({
  CALENDAR: 'calendar',
  TABLE: 'bookings',
});

export const getArraysFromTree = (tree) => Object.entries(tree).reduce((acc, [treeKey, { checked }]) => {
  if (!checked) {
    return acc;
  }

  const keys = treeKey.split('_');

  const name = keys[0];
  const value = keys[keys.length - 1];

  if (!acc[name]) {
    return { ...acc, [name]: [value] };
  }

  return { ...acc, [name]: [...acc[name], value] };
}, {});

export const setBookingMode = (mode) => localStorage.setItem(BOOKING_TYPE_MODE_KEY, mode);

export const getBookingMode = () => localStorage.getItem(BOOKING_TYPE_MODE_KEY);

export default {
  BOOKING_VIEW_MODES,
  getArraysFromTree,
  setBookingMode,
  getBookingMode,
};
