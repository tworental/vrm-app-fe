import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
  },

  actions: {
    setList: ({ commit }) => service.fees.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => service.fees.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => service.fees.create(data),

    update: (state, data) => service.fees.update(data.id, data),

    delete: (state, id) => service.fees.remove(id),

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
