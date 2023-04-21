import { LIMITS } from '@/utils/acl';
import { HTTP_CODES } from '@/utils/errorCodes';
import store from '@/plugins/store';
import dayjs from '@/utils/dayjs';
import errorHandler from '@/utils/errorHandler';
import { BOOKING_VIEW_MODES, getBookingMode } from '@/modules/bookings/utils/filters';

export default [
  {
    path: '/bookings/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_BOOKINGS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "bookings" */ '../Bookings.vue'),
    children: [
      {
        path: '',
        name: 'bookings',
        beforeEnter: (to, from, next) => {
          if (store.getters['account/trialExpired']) {
            return next(errorHandler({ status: HTTP_CODES.PAYMENT_REQUIRED }));
          }

          const mode = getBookingMode();

          if (mode === BOOKING_VIEW_MODES.CALENDAR) {
            return next({ name: mode });
          }

          store.commit('bookings/SET_FILTERS', {
            startDate: dayjs()
              .tz(store.getters['core/timezone'])
              .startOf('month')
              .utc()
              .toDate()
              .toISOString(),
            endDate: dayjs()
              .tz(store.getters['core/timezone'])
              .endOf('month')
              .utc()
              .toDate()
              .toISOString(),
            priceMin: 0,
            priceMax: 100000,
          });

          return next();
        },
        component: () => import(/* webpackChunkName: "bookings" */ '../views/BookingsMain.vue'),
        children: [
          {
            path: 'create',
            name: 'bookings-create',
            meta: { drawer: true },
            beforeEnter: (to, from, next) => (
              Promise.all([
                store.commit('bookings/SET_ENTITY', null),
              ]).then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
            component: () => import(/* webpackChunkName: "bookings-create" */ '../views/BookingsBookingForm.vue'),
          },
          {
            path: ':id',
            name: 'bookings-overview',
            component: () => import(/* webpackChunkName: "bookings" */ '../views/BookingsOverview.vue'),
            children: [
              {
                path: 'edit',
                name: 'bookings-overview-edit',
                meta: { drawer: true },
                component: () => import(/* webpackChunkName: "bookings" */ '../views/BookingsBookingForm.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
];
