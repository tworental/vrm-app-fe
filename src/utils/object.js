export const getDeepValue = (obj, key) => {
  const keys = key.split('.');

  if (keys.length === 1) {
    return obj[keys[0]];
  }

  return getDeepValue(obj[keys[0]], keys.slice(1).join('.'));
};

export default { getDeepValue };
