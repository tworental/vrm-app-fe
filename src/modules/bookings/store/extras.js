import { getSumOfObjects } from '@/utils/number';

import { EXTRAS_TYPES } from '../services/extras';
import service from '../services';

export default {
  namespaced: true,
  state: {
    list: [],
    entity: null,
  },
  actions: {
    setList: ({ commit }, { bookingId }) => service.extras.list(bookingId)
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, { bookingId, id }) => service.extras.show(bookingId, id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, { bookingId, data }) => service.extras.create(bookingId, data),

    update: (state, { bookingId, id, data }) => service.extras.update(bookingId, id, data),

    delete: (state, { bookingId, id }) => service.extras.remove(bookingId, id),

    upsert: ({ dispatch, state: { entity } }, { data, bookingId }) => (
      entity ? dispatch('update', { bookingId, data, id: entity.id }) : dispatch('create', { bookingId, data })
    ),
  },
  mutations: {
    SET_LIST(state, data) {
      state.list = data;
    },
    SET_ENTITY(state, data) {
      state.entity = data;
    },
  },

  getters: {
    services(state) {
      return state.list.filter(({ extrasType }) => extrasType === EXTRAS_TYPES.SERVICE);
    },
    taxes(state) {
      return state.list.filter(({ extrasType }) => extrasType === EXTRAS_TYPES.TAX);
    },
    fees(state) {
      return state.list.filter(({ extrasType }) => extrasType === EXTRAS_TYPES.FEE);
    },
    total(state) {
      return getSumOfObjects(state.list, 'totalAmountExchanged');
    },
    totalServices(state, getters) {
      return getSumOfObjects(getters.services, 'totalAmountExchanged');
    },
    totalTaxes(state, getters) {
      return getSumOfObjects(getters.taxes, 'totalAmountExchanged');
    },
    totalFees(state, getters) {
      return getSumOfObjects(getters.fees, 'totalAmountExchanged');
    },
  },
};
