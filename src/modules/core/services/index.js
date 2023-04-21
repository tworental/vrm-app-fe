import { sendRequest } from '@/utils/request';

export const DISCOUNT_TYPES = Object.freeze({
  AMOUNT: 'amount',
  PERCENTAGE: 'percentage',
});

export const DOCUMENT_TYPES = Object.freeze({
  ID_CARD: 'idCard',
  PASSPORT: 'passport',
  DRIVING_LICENSE: 'drivingLicense',
});

export const getLimits = () => sendRequest('limits');
export const getConfig = () => sendRequest('config');

export const getCurrencies = () => sendRequest('dictionaries/currency-rates')
  .then(({ data: [currencyRates] }) => {
    if (!currencyRates) {
      return [];
    }

    return [
      currencyRates.base,
      ...Object.keys(currencyRates.rates),
    ].map((currencyCode) => currencyCode.toUpperCase());
  });

export const getGuestTypes = () => sendRequest('dictionaries/guest-types');

export default {
  DISCOUNT_TYPES,
  getLimits,
  getConfig,
  getCurrencies,
  getGuestTypes,
};
