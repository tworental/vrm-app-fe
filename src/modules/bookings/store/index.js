import service, { BOOKINGS_PER_PAGE } from '../services';
import guests from './guests';
import extras from './extras';
import payments from './payments';

export default {
  namespaced: true,
  modules: {
    guests,
    extras,
    payments,
  },
  state: {
    list: [],
    entity: null,
    selecting: false,
    formLoading: false,
    loading: false,
    pagination: {
      currentPage: 1,
      perPage: BOOKINGS_PER_PAGE,
      total: 0,
    },
    filters: {
      startDate: null,
      endDate: null,
      priceMin: 0,
      priceMax: 100000,
    },
    rentalTree: {
      value: null,
      dict: [],
      cache: {},
    },
    availability: null,
  },
  actions: {
    setList: ({ commit, state }) => service.bookings.list({
      ...state.filters,
      perPage: state.pagination.perPage,
    })
      .then(({ data, meta: { pagination } }) => {
        commit('SET_LIST', data);
        commit('SET_PAGINATION', pagination);
      }),

    setEntity: ({ commit }, id) => {
      commit('SET_SELECTING', true);

      return service.bookings.show(id)
        .then(({ data }) => commit('SET_ENTITY', data))
        .then(() => commit('SET_SELECTING', false));
    },

    refreshEntity: ({ commit }, id) => service.bookings.show(id)
      .then(({ data }) => commit('REFRESH_ENTITY', data)),

    loadMore: ({ state, commit }) => {
      commit('SET_LOADING', true);
      return service.bookings.list({
        ...state.filters,
        perPage: state.pagination.perPage,
        currentPage: state.pagination.currentPage + 1,
      })
        .then(({ data, meta: { pagination } }) => {
          commit('SET_LOADING', false);
          commit('SET_LIST', [...state.list, ...data]);
          commit('SET_PAGINATION', pagination);
        })
        .catch(() => commit('SET_LOADING', false));
    },

    create: (state, data) => service.bookings.create(data),

    update: (state, data) => service.bookings.update(data.id, data),

    delete: ({ commit }, id) => service.bookings.remove(id)
      .then(() => commit('DELETE_BOOKING', id)),

    upsert: ({ dispatch, state: { entity } }, data) => (
      entity ? dispatch('update', { ...data, id: entity.id }) : dispatch('create', data)
    ),

    changeStatus: ({ commit }, { id, status }) => service.bookings.update(id, { status })
      .then(() => commit('REFRESH_ENTITY', { id, status })),

    checkAvailability: ({ commit }, payload) => service.bookings.checkAvailability(payload)
      .then(({ data }) => {
        commit('SET_AVAILABILITY', data);

        return data;
      }),
  },
  mutations: {
    SET_LIST(state, data) {
      state.list = data;
    },
    SET_PAGINATION(state, data) {
      state.pagination = data;
    },
    SET_ENTITY(state, data) {
      state.entity = data;
    },
    SET_SELECTING(state, data) {
      state.selecting = data;
    },
    SET_LOADING(state, data) {
      state.loading = data;
    },
    SET_FORM_LOADING(state, data) {
      state.formLoading = data;
    },
    SET_FILTERS(state, data) {
      state.filters = data;
    },
    SET_RENTAL_TREE_VALUE(state, data) {
      state.rentalTree.value = data;
    },
    SET_RENTAL_TREE_DICT(state, data) {
      state.rentalTree.dict = data;
    },
    SET_RENTAL_TREE_CACHE(state, key) {
      state.rentalTree.cache[key] = true;
    },
    REFRESH_ENTITY(state, data) {
      state.list = state.list.map((item) => ({
        ...item,
        ...(item.id === data.id ? data : {}),
      }));
      state.entity = { ...state.entity, ...data };
    },
    SET_AVAILABILITY(state, data) {
      state.availability = data;
    },
    DELETE_BOOKING(state, id) {
      state.list = state.list.filter((item) => item.id !== id);
    },
  },

  getters: {
    canLoadMore(state) {
      return (state.pagination.to - state.pagination.from) === state.pagination.perPage;
    },
  },
};
