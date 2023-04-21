import service from '../services';

export default {
  namespaced: true,

  state: {
    entity: null,
    list: [],
  },

  actions: {
    setUnits: ({ commit }, { propertyId, propertyUnitTypeId }) => service.units.list(propertyId, propertyUnitTypeId)
      .then(({ data }) => commit('SET_UNITS', data)),

    setUnit: ({ commit }, { propertyId, propertyUnitTypeId, id }) => service.units.show(
      propertyId,
      propertyUnitTypeId,
      id,
    )
      .then(({ data }) => commit('SET_UNIT', data)),

    createUnit: (state, data) => service.units.create(data.propertyId, data.propertyUnitTypeId, data),

    updateUnit: ({ commit }, data) => service.units.update(
      data.propertyId,
      data.propertyUnitTypeId,
      data.id,
      data,
    )
      .then(() => commit('UPDATE_UNIT', data)),

    deleteUnit: (state, { propertyId, propertyUnitTypeId, id }) => service.units.remove(
      propertyId,
      propertyUnitTypeId,
      id,
    ),
  },

  mutations: {
    SET_UNITS(state, data) {
      state.list = data;
    },

    SET_UNIT(state, data) {
      state.entity = data;
    },

    UPDATE_UNIT(state, data) {
      state.list = state.list.map((item) => ({
        ...item,
        ...(item.id === data.id ? data : {}),
      }));
    },
  },

  getters: {
    autocompleteList(state) {
      return state.list
        .map((rental) => ({ label: rental.name, value: rental.id }));
    },
    arrangements(state) {
      return state.entity?.arrangements || [];
    },
    amenities(state) {
      return state.entity?.amenities || [];
    },
  },
};
