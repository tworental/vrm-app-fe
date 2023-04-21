import services from '../services';

import pages from './pages';

export default {
  namespaced: true,
  modules: {
    pages,
  },
  state: {
    list: [],
    entity: null,
  },
  actions: {
    setList: ({ commit }) => services.websites.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => services.websites.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => services.websites.create(data),

    update: (state, { id, data }) => services.websites.update(id, data),

    delete: (state, id) => services.websites.remove(id),
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
