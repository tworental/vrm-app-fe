import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
  },

  actions: {
    setList: ({ commit }, websiteId) => service.pages.list(websiteId)
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, { websiteId, id }) => service.pages.show(websiteId, id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, { websiteId, data }) => service.pages.create(websiteId, data),

    update: (state, { websiteId, id, data }) => service.pages.update(websiteId, id, data),

    delete: (state, { websiteId, id }) => service.pages.remove(websiteId, id),

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

  getters: {
    uniqueNames(state) {
      return state.list
        .filter(({ id }) => id !== state.entity?.id)
        .map(({ name }) => name);
    },
  },
};
