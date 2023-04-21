import {
  pace, revenue, occupancy, reservations,
} from '../services';

export default {
  namespaced: true,

  state: {
    pace: {
      data: [],
      loading: false,
    },
    revenue: {
      data: [
        {
          year: new Date().getFullYear() - 1,
          labels: new Array(12).fill(0).map((_, i) => i),
          data: new Array(12).fill(0),
        },
        {
          year: new Date().getFullYear(),
          labels: new Array(12).fill(0).map((_, i) => i),
          data: new Array(12).fill(0),
        },
      ],
      type: 'income',
      loading: false,
    },
    occupancy: {
      data: [],
      loading: false,
    },
    reservations: {
      data: [],
      loading: false,
    },
    propertyId: null,
  },

  actions: {
    setProperty: ({ commit, dispatch }, id) => {
      commit('SET_PROPERTY', id);

      return Promise.all([
        dispatch('setPace'),
        dispatch('setRevenue'),
        dispatch('setOccupancy'),
        dispatch('setReservations'),
      ]);
    },

    setPace: ({ commit, state: { propertyId } }, { year, compareToYear } = {}) => {
      commit('SET_PACE_LOADING', true);

      return pace(year, compareToYear, propertyId)
        .then(({ data }) => commit('SET_PACE', data))
        .finally(() => commit('SET_PACE_LOADING', false));
    },

    setRevenue: ({ commit, state: { propertyId, revenue: { type } } }, { year, compareToYear } = {}) => {
      commit('SET_REVENUE_LOADING', true);

      return revenue(type, year, compareToYear, propertyId)
        .then(({ data }) => commit('SET_REVENUE', data))
        .finally(() => commit('SET_REVENUE_LOADING', false));
    },

    setRevenueType: ({ commit, dispatch }, { type, year, compareToYear }) => {
      commit('SET_REVENUE_TYPE', type);
      return dispatch('setRevenue', { year, compareToYear });
    },

    setOccupancy: ({ commit, state: { propertyId } }, { year, compareToYear } = {}) => {
      commit('SET_OCCUPANCY_LOADING', true);

      return occupancy(year, compareToYear, propertyId)
        .then(({ data }) => commit('SET_OCCUPANCY', data))
        .finally(() => commit('SET_OCCUPANCY_LOADING', false));
    },

    setReservations: ({ commit, state: { propertyId } }, { year, compareToYear } = {}) => {
      commit('SET_RESERVATIONS_LOADING', true);

      return reservations(year, compareToYear, propertyId)
        .then(({ data }) => commit('SET_RESERVATIONS', data))
        .finally(() => commit('SET_RESERVATIONS_LOADING', false));
    },
  },

  mutations: {
    SET_PACE(state, data) {
      state.pace.data = data;
    },

    SET_PACE_LOADING(state, loading) {
      state.pace.loading = loading;
    },

    SET_REVENUE(state, data) {
      state.revenue.data = data;
    },

    SET_REVENUE_LOADING(state, loading) {
      state.revenue.loading = loading;
    },

    SET_REVENUE_TYPE(state, type) {
      state.revenue.type = type;
    },

    SET_OCCUPANCY(state, data) {
      state.occupancy.data = data;
    },

    SET_OCCUPANCY_LOADING(state, loading) {
      state.occupancy.loading = loading;
    },

    SET_RESERVATIONS(state, data) {
      state.reservations.data = data;
    },

    SET_RESERVATIONS_LOADING(state, loading) {
      state.reservations.loading = loading;
    },

    SET_PROPERTY(state, id) {
      state.propertyId = id;
    },
  },
};
