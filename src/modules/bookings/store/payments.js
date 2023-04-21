import service from '../services';

export default {
  namespaced: true,
  state: {
    list: [],
    entity: null,
  },
  actions: {
    setList: ({ commit }, bookingId) => service.payments.list(bookingId)
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, { bookingId, id }) => service.payments.show(bookingId, id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, { bookingId, data }) => service.payments.create(bookingId, data),

    update: (state, { bookingId, id, data }) => service.payments.update(bookingId, id, data),

    delete: (state, { bookingId, id }) => service.payments.remove(bookingId, id),

    upsert: ({ dispatch, state: { entity } }, data) => (
      entity ? dispatch('update', { ...data, id: entity.id }) : dispatch('create', data)
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
};
