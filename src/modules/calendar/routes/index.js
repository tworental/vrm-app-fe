import { LIMITS } from '@/utils/acl';
import { HTTP_CODES } from '@/utils/errorCodes';
import store from '@/plugins/store';
import dayjs from '@/utils/dayjs';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/calendar/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_BOOKINGS_CALENDAR_ENABLED,
    },
    component: () => import(/* webpackChunkName: "calendar" */ '../Calendar.vue'),
    children: [
      {
        path: '',
        name: 'calendar',
        component: () => import(/* webpackChunkName: "calendar" */ '../views/CalendarMain.vue'),
        beforeEnter: (to, from, next) => {
          store.commit('calendar/SET_RANGES', {
            startDate: dayjs()
              .tz(store.getters['core/timezone'])
              .startOf('month')
              .utc()
              .subtract(1, 'month')
              .toDate()
              .toISOString(),
            endDate: dayjs()
              .tz(store.getters['core/timezone'])
              .startOf('month')
              .utc()
              .add(2, 'month')
              .endOf('month')
              .toISOString(),
          });

          if (store.getters['account/trialExpired']) {
            return next(errorHandler({ status: HTTP_CODES.PAYMENT_REQUIRED }));
          }

          return next();
        },
        children: [
          {
            path: 'create',
            name: 'calendar-create',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "calendar" */ '../../bookings/views/BookingsBookingForm.vue'),
          },
          {
            path: ':id/edit',
            name: 'calendar-overview',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "calendar" */ '../../bookings/views/BookingsBookingForm.vue'),
          },
        ],
      },
    ],
  },
];
