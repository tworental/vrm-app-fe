import service, { ARRANGEMENT_TYPES, DISTANCE_TYPES } from '../services';
import rentals from './rentals';
import rentalTypes from './rentalTypes';
import units from './units';
import images from './images';
import seasonRates from './seasonRates';
import services from './services';
import fees from './fees';
import taxes from './taxes';
import customerContacts from './customerContacts';
import channels from './channels';

export default {
  namespaced: true,
  modules: {
    rentals,
    rentalTypes,
    units,
    images,
    seasonRates,
    services,
    fees,
    taxes,
    channels,
    customerContacts,
  },
  state: {
    photos: [],
    dicts: {
      propertyTypes: [],
      amenities: [],
      rooms: [],
      sleeping: [],
      arrangementsTypes: ARRANGEMENT_TYPES,
      distanceTypes: DISTANCE_TYPES,
    },
  },

  actions: {
    getPropertyTypes: ({ commit }) => service.getPropertyTypes()
      .then(({ data }) => commit('SET_PROPERTY_TYPES', data)),

    getAmenities: ({ commit }, { type }) => service.getAmenities({ type })
      .then(({ data }) => commit('SET_AMENITIES', data)),

    getRooms: ({ commit }) => service.getArrangements(ARRANGEMENT_TYPES.ROOMS)
      .then(({ data }) => commit('SET_ROOMS', data)),

    getSleeping: ({ commit }) => service.getArrangements(ARRANGEMENT_TYPES.SLEEPING)
      .then(({ data }) => commit('SET_SLEEPING', data)),
  },

  mutations: {
    SET_PROPERTY_TYPES(state, data) {
      state.dicts.propertyTypes = data;
    },

    SET_AMENITIES(state, data) {
      state.dicts.amenities = data;
    },

    SET_ROOMS(state, data) {
      state.dicts.rooms = data;
    },

    SET_SLEEPING(state, data) {
      state.dicts.sleeping = data;
    },
  },
};
