import {
  signinRequest,
  signoutRequest,
  phoneVerificationRequest,
  phoneVerificationConfirm,
} from '../services';

const COOKIE_ACCESS_TOKEN = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));

export default {
  namespaced: true,
  state: {
    error: null,
    isLoggedIn: !!COOKIE_ACCESS_TOKEN,
    accessToken: COOKIE_ACCESS_TOKEN ? COOKIE_ACCESS_TOKEN[2] : null,
  },

  actions: {
    signin: ({ commit }, payload) => new Promise((resolve, reject) => {
      signinRequest(payload).then(({ data }) => {
        const expires = (new Date(Date.now() + data.expiresIn * 1000)).toUTCString();

        document.cookie = [
          `accessToken=${data.accessToken}`,
          `expires=${expires}`,
          'path=/',
        ].join(';');

        commit('SET_SIGNIN_SUCCESS', data);

        resolve(data);
      }).catch((err) => {
        commit('SET_SIGNIN_FAILURE', err);
        reject(err);
      });
    }),

    signout: ({ commit }) => signoutRequest()
      .catch(() => {})
      .finally(() => {
        document.cookie = [
          'accessToken=',
          'expires=Thu, 01 Jan 1970 00:00:00 GMT',
          'path=/',
        ].join(';');

        commit('SET_SIGNOUT');
      }),

    requestPhoneVerification: (state, data) => phoneVerificationRequest(data),
    confirmPhoneVerification: (state, data) => phoneVerificationConfirm(data),
  },

  mutations: {
    SET_SIGNIN_SUCCESS(state) {
      state.error = null;
    },

    SET_SIGNIN_FAILURE(state, error) {
      state.error = error;
      state.isLoggedIn = false;
      state.accessToken = null;
    },

    SET_SIGNOUT(state) {
      state.error = null;
      state.accessToken = null;
    },
  },
};
