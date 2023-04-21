import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/organization/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
    },
    name: 'organization',
    component: () => import(/* webpackChunkName: "organization" */ '../Organization.vue'),
    beforeEnter: (to, from, next) => store.dispatch('core/setCurrencies')
      .then(() => next())
      .catch((err) => next(errorHandler(err))),
  },
];
