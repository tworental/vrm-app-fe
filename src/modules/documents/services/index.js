import * as invoices from './invoices';

const SORT_DEFAULTS = Object.freeze({
  key: 'invoiceDate',
  order: 'desc',
});

export default {
  SORT_DEFAULTS,
  invoices,
};
