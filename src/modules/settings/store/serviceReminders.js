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
    setList: ({ commit }, serviceId) => service.serviceReminders.list(serviceId)
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity: ({ commit }, payload) => {
      commit('SET_ENTITY_LOADING', true);

      return service.serviceReminders.show(payload.serviceId, payload.id)
        .then(({ data }) => commit('SET_ENTITY', data))
        .finally(() => commit('SET_ENTITY_LOADING', false));
    },

    create: (state, data) => service.serviceReminders.create(data.serviceId, data),

    update: (state, data) => service.serviceReminders.update(data.serviceId, data.id, data),

    delete: (state, { serviceId, id }) => service.serviceReminders.remove(serviceId, id),

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
