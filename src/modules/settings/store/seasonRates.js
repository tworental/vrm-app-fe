import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
  },

  actions: {
    setList: ({ commit }) => service.seasonRates.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => service.seasonRates.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => service.seasonRates.create(data),

    update: (state, data) => service.seasonRates.update(data.id, data),

    delete: (state, id) => service.seasonRates.remove(id),
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
