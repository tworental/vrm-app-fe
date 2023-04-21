import sortable from '@/utils/sortable';
import services from '../services';

export default {
  namespaced: true,
  state: {
    guests: [],
    search: [],
    guest: null,
    tableLoading: false,
    formLoading: false,
    sort: services.guests.SORT_DEFAULTS,
    pagination: {
      currentPage: 1,
      perPage: 10,
    },
  },
  actions: {
    setGuestsList: ({ commit, state: { pagination: { currentPage, perPage } } }) => {
      commit('SET_TABLE_LOADING', true);

      return services.guests.list({ currentPage, perPage })
        .then(({ data, meta }) => {
          commit('SET_GUESTS', data);
          commit('SET_PAGINATION', meta.pagination);
        })
        .finally(() => { commit('SET_TABLE_LOADING', false); });
    },

    search: ({ commit }, search) => services.guests.list({ search })
      .then(({ data }) => commit('SET_SEARCH', data)),

    setGuestById: ({ commit }, id) => services.guests.show(id)
      .then(({ data }) => {
        commit('SET_GUEST', data);
        return data;
      }),

    createGuest: (state, data) => services.guests.create(data),

    updateGuest: (state, data) => services.guests.update(data.id, data),

    upsertGuest: ({ dispatch, state: { guest } }, data) => (
      guest ? dispatch('updateGuest', { ...data, id: guest.id }) : dispatch('createGuest', data)
    ),

    deleteGuestById: (state, id) => services.guests.remove(id),

    sort: ({ commit, dispatch }, data) => {
      commit('SET_SORT', data);
      dispatch('setGuestsList');
    },

    paginate: ({ commit, dispatch }, data) => {
      commit('SET_PAGE', data);
      dispatch('setGuestsList');
    },
  },
  mutations: {
    SET_GUESTS(state, data) {
      state.guests = data.sort(sortable(state.sort.key, state.sort.order));
    },
    SET_GUEST(state, data) {
      state.guest = data;
    },
    SET_SEARCH(state, data) {
      state.search = data.map((guest) => ({
        ...guest,
        fullName: `${guest.firstName} ${guest.lastName}`,
      }));
    },
    SET_SORT(state, data) {
      state.sort = data;
    },
    SET_FORM_LOADING(state, data) {
      state.formLoading = data;
    },
    SET_TABLE_LOADING(state, data) {
      state.tableLoading = data;
    },
    SET_PAGE(state, data) {
      state.pagination.currentPage = data;
    },
    SET_PAGINATION(state, data) {
      state.pagination = data;
    },
  },
};
