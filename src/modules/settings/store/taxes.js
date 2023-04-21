import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
  },

  actions: {
    setList: ({ commit }) => service.taxes.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => service.taxes.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => service.taxes.create(data),

    update: (state, data) => service.taxes.update(data.id, data),

    delete: (state, id) => service.taxes.remove(id),

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
