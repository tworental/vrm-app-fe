import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
  },

  actions: {
    setList: ({ commit }, propertyId) => service.services.list(propertyId)
      .then(({ data }) => commit('SET_LIST', data)),

    create: (state, data) => service.services.create(data.propertyId, data),

    delete: (state, data) => service.services.remove(data.propertyId, data.id),
  },

  mutations: {
    SET_LIST(state, data) {
      state.list = data;
    },
  },
};
