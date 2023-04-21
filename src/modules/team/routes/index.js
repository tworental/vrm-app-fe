import store from '@/plugins/store';
import errorHandler from '@/utils/errorHandler';
import { LIMITS } from '@/utils/acl';

export default [
  {
    path: '/team/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_TEAM_ENABLED,
    },
    component: () => import(/* webpackChunkName: "team" */ '../Team.vue'),
    children: [
      {
        path: '',
        name: 'team',
        component: () => import(/* webpackChunkName: "team" */ '../views/TeamMain.vue'),
        beforeEnter: (to, from, next) => {
          store.dispatch('team/setUsersList')
            .then(() => next())
            .catch((err) => next(errorHandler(err)));
        },
        children: [
          {
            path: 'create',
            name: 'team-create',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "team" */ '../views/TeamForm.vue'),
            beforeEnter: (to, from, next) => {
              store.dispatch('team/setPermissions')
                .then(() => store.commit('team/SET_USER'))
                .then(() => next())
                .catch((err) => next(errorHandler(err)));
            },
          },
          {
            path: ':id/edit',
            name: 'team-edit',
            meta: { drawer: true },
            component: () => import(/* webpackChunkName: "team" */ '../views/TeamForm.vue'),
            beforeEnter: (to, from, next) => (
              store.dispatch('team/setPermissions', to.params.id)
                .then(() => store.dispatch('team/setUserById', to.params.id))
                .then(() => next())
                .catch((err) => next(errorHandler(err)))
            ),
          },
        ],
      },
    ],
  },
];
