import { sendRequest, safeEncodeData, sanitizeParams } from '@/utils/request';
import { isValidYear } from '@/modules/statistics/utils/years';

const CURRENT_YEAR = new Date().getFullYear();

export const reservations = (year = CURRENT_YEAR, compareToYear = null, propertyId = null) => sendRequest(
  ['statistics/reservations', safeEncodeData(sanitizeParams({ year, compareToYear, propertyId }))].join('?'),
).then(({ data }) => ({
  data: data.filter((statistic) => isValidYear(statistic.year)),
}));

export const occupancy = (year = CURRENT_YEAR, compareToYear = null, propertyId = null) => sendRequest(
  ['statistics/occupancy', safeEncodeData(sanitizeParams({ year, compareToYear, propertyId }))].join('?'),
).then(({ data }) => ({
  data: data.filter((statistic) => isValidYear(statistic.year)),
}));

export const revenue = (
  type,
  year = CURRENT_YEAR,
  compareToYear = null,
  propertyId = null,
) => sendRequest(
  ['statistics/revenue', safeEncodeData(sanitizeParams({
    type,
    year,
    compareToYear,
    propertyId,
  }))].join('?'),
).then(({ data }) => ({
  data: data.filter((statistic) => isValidYear(statistic.year)),
}));

export const pace = (year = CURRENT_YEAR, compareToYear = null, propertyId = null) => sendRequest(
  ['statistics/pace', safeEncodeData(sanitizeParams({ year, compareToYear, propertyId }))].join('?'),
).then(({ data }) => ({
  data: data.filter((statistic) => isValidYear(statistic.year)),
}));
