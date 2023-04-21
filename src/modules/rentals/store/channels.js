import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
  },

  actions: {
    setList: ({ commit }, propertyId) => service.channels.list(propertyId)
      .then(({ data }) => commit('SET_LIST', data)),

    update: ({ commit }, { propertyId, id, data }) => service.channels.update(propertyId, id, data)
      .then(() => commit('UPDATE_LIST_ITEM', { id, data })),

    sync: (state, { propertyId, id }) => service.channels.sync(propertyId, id),
  },

  mutations: {
    SET_LIST(state, data) {
      state.list = data;
    },
    UPDATE_LIST_ITEM(state, { id, data }) {
      state.list = state.list.map((item) => ({
        ...item,
        ...(item.id === id ? data : {}),
      }));
    },
  },
};
