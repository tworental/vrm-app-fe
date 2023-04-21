import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/billing/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "billing" */ '../Billing.vue'),
    children: [
      {
        path: '',
        redirect: {
          name: 'billing-overview',
        },
      },
      {
        path: 'overview',
        name: 'billing-overview',
        component: () => import(/* webpackChunkName: "billing" */ '../views/BillingMain.vue'),
        beforeEnter: (to, from, next) => (
          Promise.all([
            store.dispatch('billing/getSubscriptions'),
            store.dispatch('billing/getPlans'),
          ]).then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
      },
      {
        path: 'checkout/success',
        name: 'billing-checkout-success',
        component: () => import(/* webpackChunkName: "billing" */ '../views/BillingCheckoutSuccess.vue'),
        beforeEnter: (to, from, next) => {
          if (!to.query.sessionId) {
            return next({ name: 'billing-overview' });
          }
          return store.dispatch('billing/getCheckoutSession', to.query.sessionId)
            .then(() => next())
            .catch(() => next({ name: 'billing-overview' }));
        },
      },
    ],
  },
];
