import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
  },

  actions: {
    setList: ({ commit }) => service.companies.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => service.companies.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => service.companies.create(data),

    update: (state, data) => service.companies.update(data.id, data),

    delete: (state, id) => service.companies.remove(id),

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
