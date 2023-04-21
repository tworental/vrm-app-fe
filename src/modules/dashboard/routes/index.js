import { hasAccess, LIMITS } from '@/utils/acl';
import store from '@/plugins/store';

export default [
  {
    path: '/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "dashboard" */ '../Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        beforeEnter: (from, to, next) => {
          const { limits } = store.state.core;
          const { user } = store.state.account;

          if (hasAccess(limits, LIMITS.APP_BOOKINGS_CALENDAR_ENABLED, user)) {
            return next({ name: 'calendar' });
          }

          if (hasAccess(limits, LIMITS.APP_PROPERTIES_ENABLED, user)) {
            return next({ name: 'rentals' });
          }

          return next({ name: 'account' });
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardMain.vue'),
      },
    ],
  },
];
