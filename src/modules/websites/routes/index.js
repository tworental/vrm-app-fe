import { LIMITS } from '@/utils/acl';
import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/websites/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_WEBSITE_BUILDER_ENABLED,
    },
    component: () => import(/* webpackChunkName: "websites" */ '../Websites.vue'),
    children: [
      {
        path: '',
        name: 'websites',
        beforeEnter: (to, from, next) => (
          store.dispatch('websites/setList')
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        component: () => import(/* webpackChunkName: "websites" */ '../views/WebsitesMain.vue'),
      },
      {
        path: ':id/edit',
        name: 'website-form',
        beforeEnter: (to, from, next) => (
          Promise.all([
            store.dispatch('websites/setEntity', to.params.id),
            store.dispatch('websites/pages/setList', to.params.id),
          ])
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        component: () => import(/* webpackChunkName: "websites" */ '../views/WebsitesForm.vue'),
      },
      {
        path: ':id/edit/:pageId/editor',
        name: 'website-editor',
        component: () => import(/* webpackChunkName: "websites" */ '../views/WebsitesEditor.vue'),
      },
    ],
  },
];
