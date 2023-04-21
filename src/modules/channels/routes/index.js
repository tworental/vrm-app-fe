import store from '@/plugins/store';
import { LIMITS } from '@/utils/acl';
import errorHandler from '@/utils/errorHandler';

export default [
  {
    path: '/channels/',
    meta: {
      drawer: false,
      navbar: true,
      requiresAuth: true,
      limitName: LIMITS.APP_CHANNELS_ENABLED,
    },
    component: () => import(/* webpackChunkName: "channels" */ '../Channels.vue'),
    children: [
      {
        path: '',
        name: 'channels',
        beforeEnter: (to, from, next) => (
          store.dispatch('channels/setList')
            .then(() => next())
            .catch((err) => next(errorHandler(err)))
        ),
        component: () => import(/* webpackChunkName: "channels" */ '../views/ChannelsMain.vue'),
      },
    ],
  },
];
