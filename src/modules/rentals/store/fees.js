import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
  },

  actions: {
    setList: ({ commit }, propertyId) => service.fees.list(propertyId)
      .then(({ data }) => commit('SET_LIST', data)),

    create: (state, data) => service.fees.create(data.propertyId, data),

    delete: (state, data) => service.fees.remove(data.propertyId, data.id),
  },

  mutations: {
    SET_LIST(state, data) {
      state.list = data;
    },
  },
};
