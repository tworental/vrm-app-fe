import dayjs from '@/utils/dayjs';

// eslint-disable-next-line import/prefer-default-export
export const getNights = (dateDeparture, dateArrival) => Math.max(dayjs(dateDeparture, 'YYYY-MM-DD').diff(dayjs(dateArrival, 'YYYY-MM-DD'), 'days'), 1);
