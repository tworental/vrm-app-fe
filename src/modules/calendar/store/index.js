import service, { BOOKING_STATUSES } from '@/modules/bookings/services';

import { list } from '../services';

export default {
  namespaced: true,

  state: {
    rentals: [],
    bookings: [],
    currentDate: new Date(),
    ranges: {
      startDate: null,
      endDate: null,
    },
    filters: {
      statuses: [BOOKING_STATUSES.DRAFT, BOOKING_STATUSES.TENTATIVE, BOOKING_STATUSES.CONFIRMED],
      perPage: 1000,
    },
    selectedSchedulerEventId: null,
    creationParams: {
      dateArrival: null,
      dateDeparture: null,
      propertyId: null,
      propertyUnitTypeId: null,
      propertyUnitTypeUnitId: null,
    },
    calendarFilters: {
      perPage: 300,
    },
  },

  actions: {
    setRentals: ({ commit, state }) => list(state.calendarFilters)
      .then(({ data }) => commit('SET_RENTALS', data)),

    setBookings: ({ commit, state }) => service.bookings.list({
      ...state.filters,
      ...state.ranges,
    })
      .then(({ data }) => commit('SET_BOOKINGS', data)),

    loadMoreBookings: ({ commit, state }) => service.bookings.list({
      ...state.filters,
      ...state.ranges,
    })
      .then(({ data }) => {
        const uniqueBookings = data.filter(({ id }) => !state.bookings.some((booking) => booking.id === id));
        commit('SET_MORE_BOOKINGS', uniqueBookings);

        return uniqueBookings;
      }),
  },

  mutations: {
    SET_RENTALS(state, data) {
      state.rentals = data;
    },

    SET_BOOKINGS(state, data) {
      state.bookings = data;
    },

    SET_MORE_BOOKINGS(state, data) {
      state.bookings = [...state.bookings, ...data];
    },

    UPDATE_BOOKING(state, data) {
      state.bookings = state.bookings.map((booking) => ({
        ...booking,
        ...(booking.id === data.id ? data : {}),
      }));
    },

    SET_CURRENT_DATE(state, data) {
      state.currentDate = data;
    },

    SET_RANGES(state, data) {
      state.ranges = data;
    },

    SET_SELECTED_EVENT_ID(state, data) {
      state.selectedSchedulerEventId = data;
    },

    DELETE_BOOKING(state, id) {
      state.bookings = state.bookings.filter((booking) => booking.id !== id);
    },

    SET_CREATION_PARAMS(state, data) {
      state.creationParams = data;
    },

    RESET_CREATION_PARAMS(state) {
      state.creationParams = {
        dateArrival: null,
        dateDeparture: null,
        propertyId: null,
        propertyUnitTypeId: null,
        propertyUnitTypeUnitId: null,
      };
    },
  },

  getters: {
    isCreateMode(state) {
      return Object.values(state.creationParams).every(Boolean);
    },
  },
};
