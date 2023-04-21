import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/owners/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_OWNERS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "owners" */ '../Owners.vue'),
    children: [
      {
        path: '',
        name: 'owners',
        component: () => import(/* webpackChunkName: "owners" */ '../views/OwnersMain.vue'),
        beforeEnter: (to, from, next) => (
          Promise.all([
            store.dispatch('owners/setOwnersList'),
            store.dispatch('rentals/rentals/setRentals'),
          ]).then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        children: [
          {
            path: 'create',
            name: 'owners-create',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "owners" */ '../views/OwnersForm.vue'),
          },
          {
            path: ':id/edit',
            name: 'owners-edit',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "owners" */ '../views/OwnersForm.vue'),
            beforeEnter: (to, from, next) => store.dispatch('owners/setOwnerById', to.params.id)
              .then(() => next())
              .catch((err) => next(errorHandler(err))),
          },
        ],
      },
    ],
  },
];
