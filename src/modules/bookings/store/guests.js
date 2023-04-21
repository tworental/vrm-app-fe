import service from '../services';

export default {
  namespaced: true,
  state: {
    list: [],
    entity: null,
  },
  actions: {
    setList: ({ commit }, { bookingId }) => service.guests.list(bookingId)
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, { bookingId, id }) => service.guests.show(bookingId, id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, { bookingId, data }) => service.guests.create(bookingId, data),

    update: (state, { bookingId, id, data }) => service.guests.update(bookingId, id, data),

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
