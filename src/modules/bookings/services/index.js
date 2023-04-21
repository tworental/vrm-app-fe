import * as bookings from './bookings';
import * as extras from './extras';
import * as guests from './guests';
import * as payments from './payments';

export const BOOKING_STATUSES = Object.freeze({
  DRAFT: 'draft',
  TENTATIVE: 'tentative',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  DECLINED: 'declined',
});

export const BOOKING_TYPES = Object.freeze({
  CONFIRMED: 'confirmed',
  OPTION: 'option',
});

export const CALCULATION_TYPES = Object.freeze({
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
});

export const BOOKINGS_FILTER_PROPERTIES = 'propertyIds';
export const BOOKINGS_FILTER_PROPERTY_UNIT_TYPES = 'propertyUnitTypeIds';
export const BOOKINGS_FILTER_PROPERTIES_UNITS = 'propertyUnitTypeUnitIds';

export const BOOKINGS_PER_PAGE = 25;

export default {
  bookings,
  extras,
  guests,
  payments,
};
