import { sendRequest, safeEncodeData } from '@/utils/request';
import { MEASURING_UNITS } from '@/modules/account/services';

import * as rentals from './rentals';
import * as rentalTypes from './rentalTypes';
import * as units from './units';
import * as images from './images';
import * as rates from './rates';
import * as seasonRates from './seasonRates';
import * as services from './services';
import * as fees from './fees';
import * as taxes from './taxes';
import * as customerContacts from './customerContacts';
import * as channels from './channels';

export const STATUSES = Object.freeze({
  READY: 'ready',
  CLEANING: 'cleaning',
  DIRTY: 'dirty',
  REPAIR: 'repair',
});

export const ARRANGEMENT_TYPES = Object.freeze({
  SLEEPING: 'sleeping',
  ROOMS: 'rooms',
});

export const DISTANCE_UNITS = Object.freeze({
  [MEASURING_UNITS.METRIC]: 'km',
  [MEASURING_UNITS.IMPERIAL]: 'mi',
});

export const DISTANCE_TYPES = Object.freeze({
  BUS: 'bus',
  MOTORWAY: 'motorway',
  TRAIN: 'train',
  AIRPORT: 'airport',
  UNDERGROUND: 'underground',
  PORT: 'port',
});

export const PRIVACY_TYPES = Object.freeze({
  PRIVATE: 'private',
  SHARED: 'shared',
});

export const AMENITIES_CATEGORIES = Object.freeze({
  ACCESSIBILITY: 'accessibility',
  BATHROOM_AND_LAUNDRY: 'bathroomAndLaundry',
  COOKING: 'cooking',
  HEATING: 'heating',
  MULTIMEDIA: 'multimedia',
  OUTSIDE: 'outside',
  PARKING: 'parking',
  POLICIES: 'policies',
  SAFETY: 'safety',
  SLEEPING: 'sleeping',
  SPA: 'spa',
  VIEW: 'view',
  OTHER: 'other',
});

export const DEFAULT_ICON = 'default-icon';

export const BOOKINGS_ATTACHED_ERROR = 'BOOKINGS_ATTACHED';

const getPropertyTypes = () => sendRequest('dictionaries/property-types');

const getAmenities = ({ type }) => sendRequest(['dictionaries/amenities', safeEncodeData({ type })].join('?'));

const getArrangements = (type) => sendRequest(['dictionaries/arrangements', safeEncodeData({ type })].join('?'));

export default {
  STATUSES,
  ARRANGEMENT_TYPES,
  DISTANCE_UNITS,
  DISTANCE_TYPES,
  DEFAULT_ICON,
  rentals,
  rentalTypes,
  units,
  images,
  rates,
  seasonRates,
  services,
  fees,
  taxes,
  channels,
  customerContacts,
  getPropertyTypes,
  getAmenities,
  getArrangements,
};
