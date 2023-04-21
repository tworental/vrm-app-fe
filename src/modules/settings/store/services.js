import service from '../services';
import reminders from './serviceReminders';

export default {
  namespaced: true,

  modules: {
    reminders,
  },

  state: {
    list: [],
    entity: null,
  },

  actions: {
    setList: ({ commit }) => service.services.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => service.services.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => service.services.create(data),

    update: (state, data) => service.services.update(data.id, data),

    delete: (state, id) => service.services.remove(id),
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
