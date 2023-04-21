import sortable from '@/utils/sortable';
import service from '../services';

export default {
  namespaced: true,

  state: {
    invoice: null,
    invoices: [],
    sort: service.SORT_DEFAULTS,
    expectedInvoiceNo: null,
    listLoading: false,
    formLoading: false,
    pagination: {
      currentPage: 1,
      perPage: 10,
      total: 0,
    },
  },

  actions: {
    sort: ({ commit, dispatch }, data) => {
      commit('SET_SORT', data);
      dispatch('setInvoicesList');
    },

    setInvoiceById: ({ commit }, id) => service.invoices.show(id)
      .then(({ data }) => commit('SET_INVOICE', data)),

    setInvoicesList: ({ commit, state }) => {
      commit('SET_LIST_LOADING', true);

      return service.invoices.list(state.pagination)
        .then(({ data, meta: { pagination } }) => {
          commit('SET_INVOICES', data);
          commit('SET_PAGINATION', pagination);
        })
        .finally(() => commit('SET_LIST_LOADING', false));
    },

    paginate: ({ commit, dispatch }, data) => {
      commit('SET_PAGE', data);
      return dispatch('setInvoicesList');
    },

    create: ({ dispatch, commit }, data) => {
      commit('SET_FORM_LOADING', true);

      return service.invoices.create(data)
        .then(() => dispatch('setInvoicesList'))
        .finally(() => commit('SET_FORM_LOADING', false));
    },

    update: ({ dispatch, commit }, data) => {
      commit('SET_FORM_LOADING', true);

      return service.invoices.update(data.id, data)
        .then(() => dispatch('setInvoiceById', data.id))
        .finally(() => commit('SET_FORM_LOADING', false));
    },

    upsert: ({ dispatch, state: { invoice } }, data) => (
      invoice ? dispatch('update', { ...data, id: invoice.id }) : dispatch('create', data)
    ),

    deleteInvoiceById: ({ dispatch }, id) => service.invoices.remove(id)
      .then(() => dispatch('setInvoicesList')),

    generateNumber: ({ commit }) => service.invoices.generateNumber()
      .then(({ data }) => commit('SET_EXPECTED_INVOICE_NO', data)),
  },

  mutations: {
    SET_INVOICES(state, data) {
      state.invoices = data.sort(sortable(state.sort.key, state.sort.order));
    },

    SET_INVOICE(state, data) {
      state.invoice = data;
    },

    SET_PAGINATION(state, data) {
      state.pagination = data;
    },

    SET_PAGE(state, data) {
      state.pagination.currentPage = data;
    },

    SET_LIST_LOADING(state, data) {
      state.listLoading = data;
    },

    SET_FORM_LOADING(state, data) {
      state.formLoading = data;
    },

    DELETE_INVOICE(state) {
      state.invoice = null;
    },

    SET_SORT(state, data) {
      state.sort = data;
    },

    SET_EXPECTED_INVOICE_NO(state, data) {
      state.expectedInvoiceNo = data;
    },
  },
};
