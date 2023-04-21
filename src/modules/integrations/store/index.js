import { formatCurrency } from '@/utils/intl';
import {
  connect as mailchimpConnect,
  lists as mailchimpLists,
} from '@/modules/integrations/services/mailchimp';
import { getAttachedIntegration, getIntegrations, setAttachedIntegration } from '../services';

export default {
  namespaced: true,

  state: {
    integrations: [],
    entity: null,
    mailchimp: {
      connect: null,
      lists: [],
    },
  },

  actions: {
    getIntegrations: ({ commit }) => getIntegrations()
      .then(({ data }) => data.map((item) => ({
        ...item,
        unitAmount: item.unitAmount
          ? formatCurrency(item.unitAmount, item.currency)
          : null,
      })))
      .then((data) => commit('SET_INTEGRATIONS', data)),

    getAttachedIntegration: ({ commit }, id) => getAttachedIntegration(id)
      .then(({ data }) => {
        commit('SET_ENTITY', data);
        return data;
      }),

    setAttachedIntegration: (state, { id, data }) => setAttachedIntegration(id, data),

    mailchimpConnect: ({ commit }, body) => mailchimpConnect(body)
      .then(() => commit('SET_MAILCHIMP_CONNECT', true)),

    mailchimpLists: ({ commit }, body) => mailchimpLists(body)
      .then(({ data }) => commit('SET_MAILCHIMP_LISTS', data)),

    reset: ({ commit }) => {
      // reset mailchimp
      commit('SET_MAILCHIMP_CONNECT', false);
      commit('SET_MAILCHIMP_LISTS', []);
    },
  },

  mutations: {
    SET_INTEGRATIONS(state, data) {
      state.integrations = data;
    },

    SET_ENTITY(state, data) {
      state.entity = data;
    },

    SET_MAILCHIMP_CONNECT(state, data) {
      state.mailchimp.connect = data;
    },

    SET_MAILCHIMP_LISTS(state, data) {
      state.mailchimp.lists = data;
    },
  },
};
