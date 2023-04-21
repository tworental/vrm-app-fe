import dayjs from '@/utils/dayjs';

const getTimeLabel = (dateFormat, time) => {
  const hours = time.hh % Number(dateFormat);
  const minutes = time.mm;

  switch (dateFormat) {
    case '12':
      return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)} ${['AM', 'PM'][Math.floor(time.hh / 12)]}`;
    default:
      return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}`;
  }
};

export const getTimes = (dateFormat, interval = 30) => {
  const count = (24 * 60) / interval;

  return new Array(count).fill(0).map((currentTime, index) => {
    const time = currentTime + (index * interval);
    const hh = Math.floor(time / 60);
    const mm = time % 60;

    return {
      label: getTimeLabel(dateFormat, { hh, mm }),
      value: `${`0${hh}`.slice(-2)}:${`0${mm}`.slice(-2)}`,
    };
  });
};

export const WEEKDAYS = [
  { name: 'mo', holiday: false },
  { name: 'tu', holiday: false },
  { name: 'we', holiday: false },
  { name: 'th', holiday: false },
  { name: 'fr', holiday: false },
  { name: 'sa', holiday: true },
  { name: 'su', holiday: true },
];

export const getMinutesFromHHMM = (time) => {
  const [hoursStr, minsStr] = time.split(':');

  return Number(hoursStr) * 60 + Number(minsStr);
};

export const getHHMMFromMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${`0${hours}`.slice(-2)}:${`0${mins}`.slice(-2)}`;
};

export const getLocaleTimeFromHHMMSS = (time, locale = 'en-US') => dayjs(time, 'HH:mm:ss').locale(locale).format('LT');

export const getMinDateForEndDateInput = (minDate) => dayjs(minDate).add(1, 'days').toDate();

export const getDiffInDays = (dateFirstStr, dateSecondStr) => {
  if (!dateFirstStr || !dateSecondStr) {
    return 0;
  }

  return dayjs(dateFirstStr, 'YYYY-MM-DD')
    .diff(dayjs(dateSecondStr, 'YYYY-MM-DD'), 'days');
};

export const dateRangeOverlaps = (aStart, aEnd, bStart, bEnd) => {
  if (aStart <= bStart && bStart <= aEnd) return true; // b starts in a
  if (aStart <= bEnd && bEnd <= aEnd) return true; // b ends in a
  if (bStart <= aStart && aEnd <= bEnd) return true; // a in b

  return false;
};

export const getDateFromFormat = (date, format = 'YYYY-MM-DD') => (date ? dayjs(date, format).toDate() : null);

export const isInputDateValid = (date) => dayjs(date, 'YYYY-MM-DD').isValid();

export const getRelativeDate = (date) => dayjs(date).fromNow();

export const getBrowserDateFormat = () => {
  const MOCK_YEAR = '2000';
  const MOCK_MONTH = '10';
  const MOCK_DAY = '20';

  const now = new Date(MOCK_YEAR, Number(MOCK_MONTH) - 1, MOCK_DAY);
  return now.toLocaleDateString()
    .toLowerCase()
    .replace(MOCK_DAY, 'dd')
    .replace(MOCK_MONTH, 'mm')
    .replace(MOCK_YEAR, 'yyyy');
};

export const getBrowserDateFormatMask = () => getBrowserDateFormat()
  .replace('dd', '##')
  .replace('mm', '##')
  .replace('yyyy', '####');

export default {
  WEEKDAYS,
  getTimes,
  getMinutesFromHHMM,
  getHHMMFromMinutes,
  getMinDateForEndDateInput,
  getDiffInDays,
  dateRangeOverlaps,
  getDateFromFormat,
  isInputDateValid,
  getRelativeDate,
};
