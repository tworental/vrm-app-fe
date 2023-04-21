import {
  getProductsPlans,
  getCurrentSubscriptions,
  getCheckoutSession,
  SUBSCRIPTION_STATUSES,
} from '../services';

export default {
  namespaced: true,

  state: {
    plans: [],
    subscriptions: [],
    checkoutSession: null,
  },

  actions: {
    getSubscriptions: ({ commit }) => getCurrentSubscriptions()
      .then(({ data }) => commit('SET_SUBSCRIPTIONS', data)),

    getPlans: ({ commit }) => getProductsPlans()
      .then(({ data }) => commit('SET_PLANS', data)),

    getCheckoutSession: ({ commit }, sessionId) => getCheckoutSession(sessionId)
      .then(({ data }) => commit('SET_CHECKOUT_SESSION', data)),
  },

  mutations: {
    SET_CHECKOUT_SESSION(state, data) {
      state.checkoutSession = data;
    },

    SET_SUBSCRIPTIONS(state, data) {
      state.subscriptions = data;
    },

    SET_PLANS(state, data) {
      state.plans = data;
    },
  },

  getters: {
    currentSubscription(state) {
      return state.subscriptions.find(({ status }) => [
        SUBSCRIPTION_STATUSES.ACTIVE,
        SUBSCRIPTION_STATUSES.UNPAID,
      ].includes(status));
    },
  },
};
