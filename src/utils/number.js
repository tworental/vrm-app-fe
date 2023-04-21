export const getSum = (array) => array.reduce((a, b) => a + b, 0);

export const getSumOfObjects = (array, field) => array.reduce((a, b) => a + b[field], 0);

export const getAverageValue = (array) => {
  if (array.length === 0) return 0;

  return getSum(array) / array.length;
};

export const getValueByPercent = (percent, total) => Number(((Number(total) * Number(percent)) / 100).toFixed(2));

export const getPercentByValue = (value, total) => {
  if (value === 0 && total === 0) return 100;

  return Number(((Number(value) / Number(total)) * 100).toFixed(2));
};
