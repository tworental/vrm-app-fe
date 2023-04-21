import dayjs from '@/utils/dayjs';

const MIN_STATISTICS_YEAR = 1900;
const MAX_STATISTICS_YEAR = 2100;

export const getPossibleYears = (userCreatedAt) => {
  const yearCreated = dayjs(userCreatedAt).get('year');
  const yearNow = dayjs().get('year');

  return [
    yearCreated,
    ...new Array(yearNow - yearCreated).fill(0)
      .map((_, i) => yearCreated + i + 1),
  ];
};

export const isValidYear = (year) => Number(year) > MIN_STATISTICS_YEAR && Number(year) < MAX_STATISTICS_YEAR;
