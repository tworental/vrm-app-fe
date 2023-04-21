import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';
import { LOCATIONS } from '@/modules/storage/utils/hierarchy';

export default [
  {
    path: '/storage/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_STORAGE_ENABLED,
    },
    component: () => import(/* webpackChunkName: "storage" */ '../Storage.vue'),
    children: [
      {
        path: '',
        name: 'storage',
        redirect: { name: 'storage-system', params: { location: 'drive' } },
        component: () => import(/* webpackChunkName: "storage" */ '../views/StorageMain.vue'),
        beforeEnter: (to, from, next) => {
          Promise.all([
            store.dispatch('storage/getQuota'),
            store.dispatch('storage/getFiles', {
              deleted: to.params.location === LOCATIONS.BIN,
            }),
            store.dispatch('storage/getFolders', {
              deleted: to.params.location === LOCATIONS.BIN,
            }),
          ]).then(() => next())
            .catch((err) => next(errorHandler(err)));
        },
        children: [
          {
            path: ':location/:id?',
            name: 'storage-system',
            component: () => import(/* webpackChunkName: "storage" */ '../views/StorageDrive.vue'),
            beforeEnter: (to, from, next) => {
              if (to.params.id && !store.state.storage.folders.find(({ id }) => Number(id) === Number(to.params.id))) {
                next('/storage/drive');
              } else {
                store.dispatch('storage/getStorage', to.params)
                  .then(() => next());
              }
            },
          },
          {
            path: 'pinned/:location/:id',
            name: 'storage-system-pinned',
            component: () => import(/* webpackChunkName: "storage" */ '../views/StorageDrive.vue'),
            beforeEnter: (to, from, next) => (
              store.dispatch('storage/getStorage', to.params)
                .then(() => next())
            ),
          },
        ],
      },
    ],
  },
];
