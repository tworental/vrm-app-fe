import dayjs from '@/utils/dayjs';
import {
  getUser,
  updateUser,
  getAccount,
  getSetupProgress,
  updateAccount,
  connectGoogleSSO,
  disconnectGoogleSSO,
} from '../services';

export default {
  namespaced: true,

  state: {
    user: null,
    account: null,
    setupProgress: null,
    setupPercentage: 0,
  },

  actions: {
    setAccount: ({ commit }) => getAccount()
      .then(({ data }) => commit('SET_ACCOUNT', data)),

    updateAccount: ({ dispatch }, data) => updateAccount(data)
      .then(() => dispatch('setAccount')),

    setSetupProgress: ({ commit }) => getSetupProgress()
      .then(({ data }) => commit('SET_SETUP_PROGRESS', data)),

    setUser: ({ commit }) => getUser()
      .then(({ data }) => commit('SET_USER', data)),

    updateUser: ({ dispatch }, data) => updateUser(data)
      .then(() => dispatch('setUser')),

    connectGoogleSSO: () => connectGoogleSSO(),

    disconnectGoogleSSO: ({ dispatch }) => disconnectGoogleSSO()
      .then(() => dispatch('setUser')),
  },

  mutations: {
    SET_ACCOUNT(state, data) {
      state.account = data;
    },

    SET_USER(state, data) {
      state.user = data;
    },

    SET_SETUP_PROGRESS(state, data) {
      const progress = Object.values(data)
        .map((section) => Object.values(section))
        .flat();

      state.setupProgress = data;
      state.setupPercentage = progress.length
        ? Math.round((progress.filter(Boolean).length / progress.length) * 100)
        : 0;
    },
  },

  getters: {
    trialExpired(state) {
      const isTrialVersion = state.account?.trialExpirationOn || undefined;

      if (!isTrialVersion) return false;

      return dayjs(isTrialVersion).isBefore(dayjs());
    },
  },
};
