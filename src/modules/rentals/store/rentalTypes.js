import service from '../services';

export default {
  namespaced: true,

  state: {
    entity: null,
    list: [],
    rates: null,
    entityLoading: false,
  },

  actions: {
    setRentalTypes: ({ commit }, id) => service.rentalTypes.list(id)
      .then(({ data }) => commit('SET_RENTAL_TYPES', data)),

    setRentalType: ({ commit, dispatch, rootState }, { propertyId, id }) => {
      commit('SET_ENTITY_LOADING', true);

      return service.rentalTypes.show(propertyId, id)
        .then(({ data }) => {
          commit('SET_RENTAL_TYPE', data);

          return dispatch('rentals/units/setUnits', {
            propertyId,
            propertyUnitTypeId: id,
          }, { root: true })
            .then(() => dispatch('rentals/units/setUnit', {
              propertyId,
              propertyUnitTypeId: id,
              id: rootState.rentals.units.list[0].id,
            }, { root: true }));
        })
        .finally(() => commit('SET_ENTITY_LOADING', false));
    },

    createRentalType: (state, data) => service.rentalTypes.create(data.propertyId, data),

    updateRentalType: ({ commit }, data) => service.rentalTypes.update(data.propertyId, data.id, data)
      .then(() => commit('UPDATE_RENTAL_TYPE', data)),

    deleteRentalType: (state, { propertyId, id }) => service.rentalTypes.remove(propertyId, id),

    setRates: ({ commit }, { propertyId, id }) => service.rates.show(propertyId, id)
      .then(({ data }) => commit('SET_RATES', data)),

    updateRates: (state, { propertyId, id, data }) => service.rates.update(propertyId, id, data),
  },

  mutations: {
    SET_RENTAL_TYPES(state, data) {
      state.list = data;
    },

    SET_RENTAL_TYPE(state, data) {
      state.entity = data;
    },

    SET_ENTITY_LOADING(state, data) {
      state.entityLoading = data;
    },

    UPDATE_RENTAL_TYPE(state, data) {
      state.entity = {
        ...state.entity,
        ...data,
      };

      state.list = state.list.map((item) => ({
        ...item,
        ...(item.id === data.id ? data : {}),
      }));
    },

    SET_RATES(state, data) {
      state.rates = data;
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
