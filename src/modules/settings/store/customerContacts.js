import service from '../services';

export default {
  namespaced: true,
  state: {
    list: [],
    entity: null,
    formLoading: false,
    entityLoading: false,
  },
  actions: {
    setList: ({ commit }) => service.customerContacts.list()
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, id) => {
      commit('SET_ENTITY_LOADING', true);

      return service.customerContacts.show(id)
        .then(({ data }) => commit('SET_ENTITY', data))
        .finally(() => commit('SET_ENTITY_LOADING', false));
    },

    create: (state, { data }) => service.customerContacts.create(data),

    update: (state, { id, data }) => service.customerContacts.update(id, data),

    delete: (state, id) => service.customerContacts.remove(id),

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
    SET_ENTITY_LOADING(state, data) {
      state.entityLoading = data;
    },
  },
};
