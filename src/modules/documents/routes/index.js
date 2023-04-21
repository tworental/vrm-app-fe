import { RouterView } from 'vue-router';

import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/documents/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_DOCUMENTS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "documents" */ '../Documents.vue'),
    children: [
      {
        path: '',
        name: 'documents',
        component: () => import(/* webpackChunkName: "documents" */ '../views/DocumentsMain.vue'),
        children: [
          {
            path: '',
            redirect: {
              name: 'documents-invoices',
            },
          },
          {
            path: 'invoices',
            meta: {
              limitName: LIMITS.APP_DOCUMENTS_INVOICES_ENABLED,
            },
            component: RouterView,
            children: [
              {
                path: '',
                name: 'documents-invoices',
                component: () => import(/* webpackChunkName: "documents-invoices" */ '../views/DocumentsInvoices.vue'),
                beforeEnter: (to, from, next) => (
                  Promise.all([
                    store.dispatch('core/setCurrencies'),
                    store.dispatch('invoices/setInvoicesList'),
                  ])
                    .then(() => next())
                    .catch((err) => next(errorHandler(err)))
                ),
                children: [
                  {
                    path: 'create',
                    name: 'documents-invoices-create',
                    meta: { drawer: true },
                    component: () => import(/* webpackChunkName: "documents-invoices" */ '../views/DocumentsInvoicesForm.vue'),
                    beforeEnter: (to, from, next) => (
                      Promise.all([
                        store.dispatch('invoices/generateNumber'),
                        store.commit('invoices/SET_INVOICE', null),
                      ])
                        .then(() => next())
                        .catch((err) => next(errorHandler(err)))
                    ),
                  },
                  {
                    path: ':id',
                    name: 'documents-invoices-details',
                    meta: { drawer: true },
                    component: () => import(/* webpackChunkName: "documents-invoices" */ '../views/DocumentsInvoicesForm.vue'),
                    beforeEnter: (to, from, next) => (
                      Promise.all([
                        store.dispatch('invoices/setInvoiceById', to.params.id),
                      ])
                        .then(() => next())
                        .catch((err) => next(errorHandler(err)))
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
