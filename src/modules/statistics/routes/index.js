import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/statistics/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_STATISTICS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "statistics" */ '../Statistics.vue'),
    beforeEnter: (to, from, next) => {
      store.dispatch('rentals/rentals/setRentals')
        .then(() => next())
        .catch((err) => next(errorHandler(err)));
    },
    children: [
      {
        path: '',
        name: 'statistics',
        component: () => import(/* webpackChunkName: "statistics" */ '../views/StatisticsMain.vue'),
      },
    ],
  },
];
