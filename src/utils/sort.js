const SORT_ATTR_DEFAULT = 'updatedAt';

export const SORT_ORDERS = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

export default function orderBy(data, sort) {
  let [attr = SORT_ATTR_DEFAULT, order = SORT_ORDERS.DESC] = sort;

  if (!data.length) {
    return [];
  }

  if (!Object.values(SORT_ORDERS).includes(order)) {
    order = SORT_ORDERS.DESC;
  }

  if (!Object.prototype.hasOwnProperty.call(data[0], attr)) {
    attr = SORT_ATTR_DEFAULT;
  }

  return data.sort((a, b) => {
    if (order === SORT_ORDERS.DESC) {
      return b[attr].localeCompare(a[attr]);
    }
    return a[attr].localeCompare(b[attr]);
  });
}
