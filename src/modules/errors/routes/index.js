export default [
  {
    path: '/errors',
    component: () => import(/* webpackChunkName: "errors" */ '../Errors.vue'),
    children: [
      {
        path: '',
        redirect: {
          name: 'error-404',
        },
      },
      {
        path: '401',
        name: 'error-401',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsUnauthorized.vue'),
      },
      {
        path: '403',
        name: 'error-403',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsForbidden.vue'),
      },
      {
        path: '404',
        name: 'error-404',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsNotFound.vue'),
      },
      {
        path: '500',
        name: 'error-500',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsInternalServerError.vue'),
      },
      {
        path: '502',
        name: 'error-502',
        component: () => import(/* webpackChunkName: "errors" */ '../views/ErrorsBadGateway.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: {
      name: 'error-404',
    },
  },
];
