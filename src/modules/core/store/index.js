import { useWindowSize } from '@vueuse/core';
import device from 'mobile-device-detect';
import currencySigns from 'currency-symbol-map/map';

import { MODULES, hasAccess } from '@/utils/acl';
import {
  getLimits,
  getConfig,
  getCurrencies,
  getGuestTypes,
} from '../services';

const { width } = useWindowSize();

export default {
  namespaced: true,

  state: {
    menu: [
      {
        id: 'bookings',
        acl: MODULES.BOOKINGS,
        link: '/bookings/',
      },
      {
        id: 'properties',
        acl: MODULES.PROPERTIES,
        link: '/rentals/',
      },
      {
        id: 'guests',
        acl: MODULES.PROPERTIES,
        link: '/guests/',
      },
      {
        id: 'owners',
        acl: MODULES.OWNERS,
        link: '/owners/',
      },
      {
        id: 'team',
        acl: MODULES.TEAM,
        link: '/team/',
      },
      {
        id: 'documents',
        acl: MODULES.DOCUMENTS,
        link: '/documents/',
      },
      {
        id: 'storage',
        acl: MODULES.STORAGE,
        link: '/storage/',
      },
      {
        id: 'channels',
        acl: MODULES.CHANNELS,
        link: '/channels/',
      },
      {
        id: 'integrations',
        acl: MODULES.INTEGRATIONS,
        link: '/integrations/',
      },
      {
        id: 'statistics',
        acl: MODULES.STATISTICS,
        link: '/statistics/',
      },
      {
        id: 'websites',
        acl: MODULES.WEBSITES,
        link: '/websites/',
      },
    ],
    userMenu: [
      [
        {
          id: 'organization',
          link: 'organization',
          icon: 'organization',
        },
        {
          id: 'account',
          link: 'account',
          icon: 'account',
        },
      ],
      [
        {
          id: 'billings',
          acl: MODULES.BILLINGS,
          link: 'billing-overview',
          icon: 'billing',
        },
        {
          id: 'settings',
          acl: MODULES.SETTINGS,
          link: 'settings',
          icon: 'settings',
        },
      ],
      [
        {
          id: 'signout',
          link: 'signout',
          icon: 'logout',
        },
      ],
    ],
    config: null,
    limits: null,
    currencies: [],
    services: [],
    guestTypes: [],
    submenuClosed: false,
  },

  getters: {
    menu: (state, getters, rootState) => state.menu.filter(
      ({ id, acl }) => hasAccess(state.limits, `account.module.${id}.enabled`, rootState.account.user, acl),
    ),

    userMenu: (state, getters, rootState) => state.userMenu.map((menu) => menu.filter(
      ({ id, acl }) => !acl || hasAccess(state.limits, `account.module.${id}.enabled`, rootState.account.user, acl),
    )),

    isMobile: () => device.isMobile || width.value < 1024,

    languages: (state) => state.limits['account.module.languages.list'],

    currencies: (state, getters, rootState) => {
      const defaultCurrency = rootState.account.account?.settings.currency;
      const currencies = state.currencies.length
        ? state.currencies
        : [defaultCurrency];

      return currencies.map((currency) => ({
        label: `${currencySigns[currency] || ''} ${currency}`,
        value: currency,
      }));
    },

    timezone: (state, getters, rootState) => {
      const defaultUserTimezone = rootState.account.user?.timezone;
      const defaultAccountTimezone = rootState.account.account?.settings.timezone;

      if (defaultUserTimezone) {
        return defaultUserTimezone;
      }

      if (defaultAccountTimezone) {
        return defaultAccountTimezone;
      }

      return undefined;
    },
  },

  actions: {
    setLimits: ({ commit }) => getLimits()
      .then(({ data }) => data.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}))
      .then((data) => commit('SET_LIMITS', data)),

    setConfig: ({ commit }) => getConfig()
      .then(({ data }) => commit('SET_CONFIG', data)),

    setCurrencies: ({ commit }) => getCurrencies()
      .then((data) => commit('SET_CURRENCIES', data)),

    setGuestTypes: ({ commit }) => getGuestTypes()
      .then(({ data }) => commit('SET_GUEST_TYPES', data)),
  },

  mutations: {
    SET_LIMITS(state, data) {
      state.limits = data;
    },

    SET_CONFIG(state, data) {
      state.config = data;
    },

    SET_CURRENCIES(state, data) {
      state.currencies = data;
    },

    SET_GUEST_TYPES(state, data) {
      state.guestTypes = data;
    },

    SET_SUBMENU_CLOSED(state, data) {
      state.submenuClosed = data;
    },
  },
};
