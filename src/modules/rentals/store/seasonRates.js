import service from '../services';

export default {
  namespaced: true,

  state: {
    entity: null,
    list: [],
  },

  actions: {
    setList: ({ commit }, {
      filter,
      propertyId,
      propertyUnitTypeId,
    }) => service.seasonRates.list(propertyId, propertyUnitTypeId, filter)
      .then(({ data }) => commit('SET_LIST', data)),

    setEntity:
      ({ commit }, {
        propertyId,
        propertyUnitTypeId,
        id,
      }) => service.seasonRates.show(propertyId, propertyUnitTypeId, id)
        .then(({ data }) => commit('SET_ENTITY', data)),

    create: (state, {
      propertyId,
      propertyUnitTypeId,
      data,
    }) => service.seasonRates.create(
      propertyId,
      propertyUnitTypeId,
      data,
    ),

    update: (state, {
      propertyId,
      propertyUnitTypeId,
      id,
      data,
    }) => service.seasonRates.update(
      propertyId,
      propertyUnitTypeId,
      id,
      data,
    ),

    delete: (state, {
      propertyId,
      propertyUnitTypeId,
      id,
    }) => service.seasonRates.remove(
      propertyId,
      propertyUnitTypeId,
      id,
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
};
