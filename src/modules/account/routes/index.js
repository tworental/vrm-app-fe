export default [
  {
    path: '/account/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "account" */ '../Account.vue'),
    name: 'account',
  },
];
