import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/guests/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_GUESTS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "guests" */ '../Guests.vue'),
    children: [
      {
        path: '',
        name: 'guests',
        component: () => import(/* webpackChunkName: "guests" */ '../views/GuestsMain.vue'),
        beforeEnter: (to, from, next) => {
          store.dispatch('guests/guests/setGuestsList')
            .then(() => next())
            .catch((err) => next(errorHandler(err)));
        },
        children: [
          {
            path: ':id/edit',
            name: 'guests-edit',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "guests" */ '../views/GuestsForm.vue'),
          },
        ],
      },
    ],
  },
];
