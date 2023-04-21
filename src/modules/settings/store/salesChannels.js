import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
    formLoading: false,
  },

  actions: {
    setList: ({ commit }) => service.salesChannels.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => service.salesChannels.show(id)
      .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, data) => service.salesChannels.create(data),

    update: (state, data) => service.salesChannels.update(data.id, data),

    delete: (state, id) => service.salesChannels.remove(id),

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
    SET_FORM_LOADING(state, data) {
      state.formLoading = data;
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
