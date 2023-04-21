import service from '../services';

export default {
  namespaced: true,

  state: {
    entity: null,
    list: [],
  },

  actions: {
    setRentals: ({ commit }) => service.rentals.list()
      .then(({ data }) => commit('SET_RENTALS', data)),

    setRental: ({ commit, dispatch, rootState }, id) => service.rentals.show(id)
      .then(({ data }) => {
        commit('SET_RENTAL', data);

        return dispatch('rentals/rentalTypes/setRentalTypes', data.id, { root: true })
          .then(() => {
            if (!data.multipleUnitTypes) {
              const unitTypeId = rootState.rentals.rentalTypes.list[0].id;

              return dispatch('rentals/rentalTypes/setRentalType', {
                propertyId: data.id,
                id: unitTypeId,
              }, { root: true });
            }

            return Promise.resolve();
          });
      }),

    createRental: (store, payload) => service.rentals.create(payload)
      .then(({ data }) => data),

    updateRental: (state, data) => service.rentals.update(data.id, data),

    deleteRental: ({ commit }, id) => service.rentals.remove(id)
      .then(() => commit('DELETE_RENTAL', id)),
  },

  mutations: {
    SET_RENTALS(state, data) {
      state.list = data;
    },

    SET_RENTAL(state, data) {
      state.entity = data;
    },

    DELETE_RENTAL(state, id) {
      state.entity = null;
      state.list = state.list.filter((item) => item.id !== id);
    },
  },

  getters: {
    autocompleteList(state) {
      return state.list
        .map((rental) => ({
          label: rental.name,
          value: rental.id,
          hidden: Boolean(rental.ownerId),
          multipleUnitTypes: Boolean(rental.multipleUnitTypes),
        }));
    },
    amenities(state) {
      return state.entity?.amenities || [];
    },
  },
};
