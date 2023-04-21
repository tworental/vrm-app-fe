import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/onboarding/',
    meta: {
      drawer: false,
      navbar: false,
      requiresAuth: true,
      limitName: LIMITS.APP_ONBOARDING_ENABLED,
    },
    component: () => import(/* webpackChunkName: "onboarding" */ '../Onboarding.vue'),
    children: [
      {
        path: '',
        name: 'onboarding',
        component: () => import(/* webpackChunkName: "onboarding" */ '../views/OnboardingMain.vue'),
        beforeEnter: (to, from, next) => {
          store.dispatch('account/setSetupProgress')
            .then(() => next())
            .catch((err) => next(errorHandler(err)));
        },
      },
    ],
  },
];
