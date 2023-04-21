import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/integrations/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_INTEGRATIONS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "integrations" */ '../Integrations.vue'),
    children: [
      {
        path: '',
        name: 'integrations',
        component: () => import(/* webpackChunkName: "integrations" */ '../views/IntegrationsMain.vue'),
        beforeEnter: (to, from, next) => {
          store.dispatch('integrations/getIntegrations')
            .then(() => next())
            .catch((err) => next(errorHandler(err)));
        },
      },
    ],
  },
];
