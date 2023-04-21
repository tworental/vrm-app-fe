import { RouterView } from 'vue-router';

import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { hasAccess, LIMITS } from '@/utils/acl';

export default [
  {
    path: '/rentals/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_PROPERTIES_ENABLED,
    },
    component: () => import(/* webpackChunkName: "rentals" */ '../Rentals.vue'),
    children: [
      {
        path: '',
        name: 'rentals',
        component: () => import(/* webpackChunkName: "rentals" */ '../views/RentalsMain.vue'),
        beforeEnter: (to, from, next) => (
          store.dispatch('rentals/rentals/setRentals')
            .then(() => {
              if (
                hasAccess(store.state.core.limits, LIMITS.APP_PROPERTIES_HOTEL_MODE_ENABLED)
                && store.state.rentals.rentals.list.length
              ) {
                return next({ name: 'rental-overview', params: { id: store.state.rentals.rentals.list[0].id } });
              }
              return next();
            })
            .catch((err) => next(errorHandler(err)))
        ),
      },
      {
        path: ':id',
        name: 'rental',
        component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalMain.vue'),
        beforeEnter: (to, from, next) => (
          Promise.all([
            store.dispatch('core/setCurrencies'),
            hasAccess(store.state.core.limits, LIMITS.APP_CHANNELS_ENABLED) && store.dispatch('channels/setList'),
            store.dispatch('rentals/rentals/setRental', to.params.id),
            store.dispatch('rentals/getPropertyTypes'),
            store.dispatch('rentals/getRooms'),
            store.dispatch('rentals/getSleeping'),
          ])
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        children: [
          {
            path: '',
            redirect: {
              name: 'rental-overview',
            },
          },
          {
            path: 'overview',
            name: 'rental-overview',
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalOverview.vue'),
            beforeEnter: (to, from, next) => (
              store.dispatch('rentals/getAmenities', { type: 'property' })
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
          },
          {
            path: 'location',
            name: 'rental-location',
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalLocation.vue'),
          },
          {
            path: 'photos',
            name: 'rental-photos',
            beforeEnter: (to, from, next) => (
              store.dispatch('rentals/images/setImages', { propertyId: to.params.id })
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalPhotos.vue'),
          },
          {
            path: 'rates',
            name: 'rental-rates',
            beforeEnter: (to, from, next) => (
              store.dispatch('rentals/rentalTypes/setRates', {
                propertyId: to.params.id, id: store.state.rentals.rentalTypes.entity.id,
              }).then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalRates.vue'),
          },
          {
            path: 'settings',
            name: 'rental-settings',
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalSettings.vue'),
          },
          {
            path: 'season-rates',
            name: 'rental-season-rates',
            component: RouterView,
            redirect: { name: 'rental-season-rates-list' },
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.dispatch('rentals/rentalTypes/setRates', {
                  propertyId: to.params.id, id: store.state.rentals.rentalTypes.entity.id,
                }),
                store.dispatch('settings/seasonRates/setList'),
                store.dispatch('rentals/seasonRates/setList', {
                  propertyId: to.params.id,
                  propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
                }),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            children: [
              {
                path: '',
                name: 'rental-season-rates-list',
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalSeasonRates.vue'),
              },
              {
                path: ':rateId',
                name: 'rental-season-rate-overview',
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalSeasonRatesOverview.vue'),
                beforeEnter: (to, from, next) => (
                  store.dispatch('rentals/seasonRates/setEntity', {
                    propertyId: to.params.id,
                    propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
                    id: to.params.rateId,
                  }).then(() => next())
                    .catch((err) => next(errorHandler(err)))
                ),
              },
            ],
          },
          {
            path: 'services',
            name: 'rental-services',
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.dispatch('rentals/services/setList', to.params.id),
                store.dispatch('settings/services/setList'),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalServices.vue'),
          },
          {
            path: 'customer-contacts',
            name: 'rental-customer-contacts',
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.dispatch('rentals/customerContacts/setList', to.params.id),
                store.dispatch('settings/customerContacts/setList'),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalCustomerContacts.vue'),
          },
          {
            path: 'fee-and-taxes',
            name: 'rental-fees-and-taxes',
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalFeesAndTaxes.vue'),
          },
          {
            path: 'channel-manager',
            name: 'rental-channel-manager',
            redirect: { name: 'rental-channel-manager-list' },
            component: RouterView,
            children: [
              {
                path: '',
                name: 'rental-channel-manager-list',
                beforeEnter: (to, from, next) => {
                  if (store.getters['channels/enabled']) {
                    return next();
                  }

                  return next(from);
                },
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsChannels.vue'),
              },
              {
                path: ':channelId',
                name: 'rental-channel-manager-edit',
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsChannelManager.vue'),
              },
            ],
          },
          {
            path: 'rental-types/:rentalTypeId',
            name: 'rental-type',
            meta: {
              limitName: LIMITS.APP_PROPERTIES_UNIT_TYPES_ENABLED,
            },
            component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/rental-types/RentalsRentalTypeMain.vue'),
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.dispatch('rentals/rentalTypes/setRentalType', {
                  propertyId: to.params.id,
                  id: to.params.rentalTypeId,
                }),
                store.dispatch('core/setGuestTypes'),
              ])
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            children: [
              {
                path: '',
                redirect: {
                  name: 'rental-type-overview',
                },
              },
              {
                path: 'overview',
                name: 'rental-type-overview',
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/rental-types/RentalsRentalTypeOverview.vue'),
                beforeEnter: (to, from, next) => (
                  store.dispatch('rentals/getAmenities', { type: 'unitType' })
                    .then(() => next())
                    .catch((err) => next(errorHandler(err)))
                ),
              },
              {
                path: 'units',
                name: 'rental-type-units',
                meta: {
                  limitName: LIMITS.APP_PROPERTIES_UNITS_ENABLED,
                },
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/rental-types/units/RentalsRentalTypeUnitsMain.vue'),
                redirect: {
                  name: 'rental-type-units-list',
                },
                children: [
                  {
                    path: '',
                    name: 'rental-type-units-list',
                    beforeEnter: (to, from, next) => (
                      store.dispatch('rentals/units/setUnits', {
                        propertyId: to.params.id,
                        propertyUnitTypeId: to.params.rentalTypeId,
                      }).then(() => next())
                        .catch((err) => next(errorHandler(err)))
                    ),
                    component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/rental-types/units/RentalsRentalTypeUnits.vue'),
                  },
                  {
                    path: ':rentalTypeUnitId',
                    name: 'rental-type-unit-overview',
                    beforeEnter: (to, from, next) => (
                      Promise.all([
                        store.dispatch('rentals/units/setUnit', {
                          propertyId: to.params.id,
                          propertyUnitTypeId: to.params.rentalTypeId,
                          id: to.params.rentalTypeUnitId,
                        }),
                        store.dispatch('rentals/getAmenities', { type: 'unitType' }),
                      ])
                        .then(() => next())
                        .catch((err) => next(errorHandler(err)))
                    ),
                    component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/rental-types/units/RentalsRentalTypeUnitOverview.vue'),
                  },
                ],
              },
              {
                path: 'photos',
                name: 'rental-type-photos',
                beforeEnter: (to, from, next) => store.dispatch('rentals/images/setImages', {
                  propertyId: to.params.id,
                  query: {
                    propertyUnitTypeId: to.params.rentalTypeId,
                  },
                }).then(() => next())
                  .catch((err) => next(errorHandler(err))),
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalPhotos.vue'),
              },
              {
                path: 'rates',
                name: 'rental-type-rates',
                beforeEnter: (to, from, next) => (
                  store.dispatch('rentals/rentalTypes/setRates', {
                    propertyId: to.params.id,
                    id: to.params.rentalTypeId,
                  }).then(() => next())
                    .catch((err) => next(errorHandler(err)))
                ),
                component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalRates.vue'),
              },
              {
                path: 'season-rates',
                name: 'rental-type-season-rates',
                component: RouterView,
                redirect: { name: 'rental-type-season-rates-list' },
                beforeEnter: (to, from, next) => (
                  Promise.all([
                    store.dispatch('rentals/rentalTypes/setRates', {
                      propertyId: to.params.id,
                      id: to.params.rentalTypeId,
                    }),
                    store.dispatch('rentals/seasonRates/setList', {
                      propertyId: to.params.id,
                      propertyUnitTypeId: to.params.rentalTypeId,
                    }),
                    store.dispatch('settings/seasonRates/setList'),
                  ])
                    .then(() => next())
                    .catch((err) => next(errorHandler(err)))
                ),
                children: [
                  {
                    path: '',
                    name: 'rental-type-season-rates-list',
                    component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalSeasonRates.vue'),
                  },
                  {
                    path: ':rateId',
                    name: 'rental-type-season-rate-overview',
                    component: () => import(/* webpackChunkName: "rentals-rental" */ '../views/RentalsRentalSeasonRatesOverview.vue'),
                    beforeEnter: (to, from, next) => (
                      store.dispatch('rentals/seasonRates/setEntity', {
                        propertyId: to.params.id,
                        propertyUnitTypeId: to.params.rentalTypeId,
                        id: to.params.rateId,
                      }).then(() => next())
                        .catch((err) => next(errorHandler(err)))
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
