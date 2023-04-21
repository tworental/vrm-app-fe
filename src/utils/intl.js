import COUNTRIES from 'country-region-data';

import dayjs from '@/utils/dayjs';
import { getBrowserDateFormat } from '@/utils/datetime';

export const formatDate = (
  datetime,
  locale = 'en-US',
  timezone = undefined,
  dateFormat = null,
  includeTime = true,
) => {
  const format = !dateFormat ? getBrowserDateFormat() : dateFormat;

  if (datetime && typeof datetime === 'string' && !datetime.includes('Z')) {
    return dayjs(datetime).locale(locale).format(`${format.toUpperCase()}${includeTime ? ' LT' : ''}`);
  }

  return (datetime ? dayjs(datetime).tz(timezone).locale(locale).format(`${format.toUpperCase()}${includeTime ? ' LT' : ''}`) : '');
};

export const formatBookingDate = (date, locale, timezone) => (
  date ? dayjs(date).tz(timezone).format('DD MMM YYYY') : ''
);

export const formatTime = (datetime, locale = 'en-US', timezone = undefined) => (
  datetime ? dayjs(datetime).tz(timezone).locale(locale).format('LT') : ''
);

export const getDateFromUtcByFormat = (datetime, timezone, format = 'YYYY-MM-DD') => dayjs.utc(datetime).tz(timezone).format(format);

export const getLocalTimeByUTC = (time, timezone = undefined, format = 'HH:mm') => dayjs.utc(time, format).tz(timezone).format(format);
export const getUTCTimeByLocal = (time, timezone = undefined, format = 'HH:mm') => dayjs.tz(time, format, timezone).utc().format(format);

export const formatCurrency = (amount, currency, locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const formatCountryName = (code, lang = 'en') => {
  const names = new Intl.DisplayNames([lang], { type: 'region' });

  return names.of(code);
};

export const formatDateForInput = (dateStr, timeHHMM = null) => {
  if (!dateStr) {
    return null;
  }

  if (timeHHMM) {
    return dayjs(dateStr).format(`YYYY-MM-DD ${timeHHMM}:00`);
  }

  return dayjs(dateStr).format('YYYY-MM-DD');
};

export const getDefaultBirthday = () => dayjs().subtract(25, 'years');

export const LANG_ISO_CODES = ['ab', 'aa', 'af', 'ak', 'sq', 'am', 'ar', 'an', 'hy', 'as', 'av', 'ae', 'ay', 'az', 'bm', 'ba', 'eu', 'be', 'bn', 'bh', 'bi', 'bs', 'br', 'bg', 'my', 'ca', 'km', 'ch', 'ce', 'ny', 'zh', 'cu', 'cv', 'kw', 'co', 'cr', 'hr', 'cs', 'da', 'dv', 'nl', 'dz', 'en', 'eo', 'et', 'ee', 'fo', 'fj', 'fi', 'fr', 'ff', 'gd', 'gl', 'lg', 'ka', 'de', 'ki', 'el', 'kl', 'gn', 'gu', 'ht', 'ha', 'he', 'hz', 'hi', 'ho', 'hu', 'is', 'io', 'ig', 'id', 'ia', 'ie', 'iu', 'ik', 'ga', 'it', 'ja', 'jv', 'kn', 'kr', 'ks', 'kk', 'rw', 'kv', 'kg', 'ko', 'kj', 'ku', 'ky', 'lo', 'la', 'lv', 'lb', 'li', 'ln', 'lt', 'lu', 'mk', 'mg', 'ms', 'ml', 'mt', 'gv', 'mi', 'mr', 'mh', 'ro', 'mn', 'na', 'nv', 'nd', 'ng', 'ne', 'se', 'no', 'nb', 'nn', 'ii', 'oc', 'oj', 'or', 'om', 'os', 'pi', 'pa', 'ps', 'fa', 'pl', 'pt', 'qu', 'rm', 'rn', 'ru', 'sm', 'sg', 'sa', 'sc', 'sr', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'st', 'nr', 'es', 'su', 'sw', 'ss', 'sv', 'tl', 'ty', 'tg', 'ta', 'tt', 'te', 'th', 'bo', 'ti', 'to', 'ts', 'tn', 'tr', 'tk', 'tw', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'cy', 'fy', 'wo', 'xh', 'yi', 'yo', 'za', 'zu'];

export const getCountryNameByCode = (code, defaultLabel) => {
  const foundCountry = COUNTRIES.find((country) => country.countryShortCode === code);

  return foundCountry ? foundCountry.countryName : defaultLabel;
};
