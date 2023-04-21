import dayjs from '@/utils/dayjs';

export const setTimeForDate = (date, time) => {
  const [hours, minutes] = time.split(':');

  return dayjs(date)
    .set('seconds', 0)
    .set('minutes', minutes)
    .set('hours', hours)
    .toDate();
};

export const areInTheSameDay = (first, second) => dayjs(first).format('YYYY-MM-DD') === dayjs(second).format('YYYY-MM-DD');
