export default function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
      return 0;
    }

    const cmpA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const cmpB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;

    if (cmpA > cmpB) {
      comparison = 1;
    } else if (cmpA < cmpB) {
      comparison = -1;
    }

    return (order === 'desc') ? (comparison * -1) : comparison;
  };
}
