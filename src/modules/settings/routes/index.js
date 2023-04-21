import { RouterView } from 'vue-router';

import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/settings/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_SETTINGS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "settings" */ '../Settings.vue'),
    beforeEnter: (to, from, next) => store.dispatch('core/setCurrencies')
      .then(() => next())
      .catch((err) => next(errorHandler(err))),
    children: [
      {
        path: '',
        name: 'settings',
        redirect: { name: 'settings-sales-channels' },
      },
      {
        path: 'payments',
        name: 'settings-payments',
        component: () => import(/* webpackChunkName: "settings-payments" */ '../views/payments/SettingsPayments.vue'),
        children: [
          {
            path: 'credit-card',
            name: 'settings-payments-cc',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "settings-payments" */ '../views/payments/SettingsPaymentsCreditCard.vue'),
          },
          {
            path: 'paypal',
            name: 'settings-payments-paypal',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "settings-payments" */ '../views/payments/SettingsPaymentsPayPal.vue'),
          },
          {
            path: 'bank-account',
            name: 'settings-payments-bank-account',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "settings-payments" */ '../views/payments/SettingsPaymentsBankAccount.vue'),
          },
        ],
      },
      {
        path: 'sales-channels',
        name: 'settings-sales-channels',
        redirect: {
          name: 'settings-sales-channels-list',
        },
        meta: {
          limitName: LIMITS.APP_SALES_CHANNELS_ENABLED,
        },
        component: RouterView,
        children: [
          {
            path: '',
            name: 'settings-sales-channels-list',
            beforeEnter: (to, from, next) => (
              store.dispatch('settings/salesChannels/setList')
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-sales-channels" */ '../views/sales-channels/SettingsSalesChannels.vue'),
          },
        ],
      },
      {
        path: 'services',
        name: 'settings-services',
        meta: {
          limitName: LIMITS.APP_SERVICES_ENABLED,
        },
        redirect: {
          name: 'settings-services-list',
        },
        component: RouterView,
        beforeEnter: (to, from, next) => (
          store.dispatch('settings/serviceProviders/setList')
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        children: [
          {
            path: '',
            name: 'settings-services-list',
            beforeEnter: (to, from, next) => (
              store.dispatch('settings/services/setList')
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-services" */ '../views/services/SettingsServices.vue'),
            children: [
              {
                path: 'providers/create',
                name: 'settings-service-providers-create',
                meta: { drawer: true },
                component: () => import(/* webpackChunkName: "settings-services" */ '../views/services/SettingsServiceProviderForm.vue'),
              },
              {
                path: 'providers/:id',
                name: 'settings-service-providers-edit',
                meta: { drawer: true },
                component: () => import(/* webpackChunkName: "settings-services" */ '../views/services/SettingsServiceProviderForm.vue'),
              },
            ],
          },
          {
            path: ':id',
            name: 'settings-services-overview',
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.dispatch('settings/services/setEntity', to.params.id),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-services" */ '../views/services/SettingsServicesUpdate.vue'),
            children: [
              {
                path: 'reminders/create',
                name: 'settings-services-reminders-create',
                meta: { drawer: true },
                component: () => import(/* webpackChunkName: "settings-services" */ '../components/services/SettingsServiceReminderForm.vue'),
              },
              {
                path: 'reminders/:reminderId',
                name: 'settings-services-reminders-overview',
                meta: { drawer: true },
                component: () => import(/* webpackChunkName: "settings-services" */ '../components/services/SettingsServiceReminderForm.vue'),
              },
            ],
          },
        ],
      },
      {
        path: 'fees-and-taxes',
        name: 'settings-fees',
        meta: {
          limitName: LIMITS.APP_FEES_ENABLED,
        },
        redirect: {
          name: 'settings-fees-list',
        },
        component: RouterView,
        children: [
          {
            path: '',
            name: 'settings-fees-list',
            component: () => import(/* webpackChunkName: "settings-fees" */ '../views/fees/SettingsFees.vue'),
          },
          {
            path: 'fees/create',
            name: 'settings-fees-create',
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.commit('settings/fees/SET_ENTITY', null),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-fees" */ '../views/fees/SettingsFeesCreate.vue'),
          },
          {
            path: 'fees/:id',
            name: 'settings-fees-overview',
            beforeEnter: (to, from, next) => (
              store.dispatch('settings/fees/setEntity', to.params.id)
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-fees" */ '../views/fees/SettingsFeesUpdate.vue'),
          },
          {
            path: 'taxes/create',
            name: 'settings-taxes-create',
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.commit('settings/taxes/SET_ENTITY', null),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-taxes" */ '../views/fees/SettingsTaxesCreate.vue'),
          },
          {
            path: 'taxes/:id',
            name: 'settings-taxes-overview',
            beforeEnter: (to, from, next) => (
              store.dispatch('settings/taxes/setEntity', to.params.id)
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "settings-taxes" */ '../views/fees/SettingsTaxesUpdate.vue'),
          },
        ],
      },
      {
        path: 'season-rates',
        name: 'settings-season-rates',
        meta: {
          limitName: LIMITS.APP_RATE_SEASONS_ENABLED,
        },
        redirect: {
          name: 'settings-season-rates-list',
        },
        component: RouterView,
        beforeEnter: (to, from, next) => (
          Promise.all([
            store.dispatch('settings/seasonRates/setList'),
          ])
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        children: [
          {
            path: '',
            name: 'settings-season-rates-list',
            component: () => import(/* webpackChunkName: "settings-season-rates" */ '../views/rates/SettingsSeasonRates.vue'),
          },
          {
            path: ':rateId',
            name: 'settings-season-rates-overview',
            component: () => import(/* webpackChunkName: "settings-season-rates" */ '../views/rates/SettingsSeasonRateOverview.vue'),
            beforeEnter: (to, from, next) => (
              store.dispatch('settings/seasonRates/setEntity', to.params.rateId)
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
          },
        ],
      },
      {
        path: 'customer-contacts',
        name: 'settings-customer-contacts',
        beforeEnter: (to, from, next) => (
          store.dispatch('settings/customerContacts/setList')
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        component: () => import(/* webpackChunkName: "settings-customer-contacts" */ '../views/customer-contacts/SettingsCustomerContacts.vue'),
        children: [
          {
            path: 'create',
            name: 'settings-customer-contacts-create',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "settings-customer-contacts" */ '../views/customer-contacts/SettingsCustomerContactForm.vue'),
          },
          {
            path: ':id',
            name: 'settings-customer-contacts-edit',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "settings-customer-contacts" */ '../views/customer-contacts/SettingsCustomerContactForm.vue'),
          },
        ],
      },
    ],
  },
];
