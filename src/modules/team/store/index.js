import sortable from '@/utils/sortable';
import { MODULES, ABILITIES } from '@/utils/acl';
import {
  SORT_DEFAULTS,
  list,
  show,
  remove,
  permissions,
  create,
  update,
  changeLockedState,
  sendEmailConfirmation,
} from '../services';

export default {
  namespaced: true,

  state: {
    user: null,
    users: [],
    permissions: [],
    permissionTypes: Object.values(ABILITIES),
    sort: SORT_DEFAULTS,
    loading: false,
  },

  getters: {
    userPermissions: (state) => state.permissions.reduce((acc, curr) => {
      const data = {};

      if (curr.allowRead) {
        data[ABILITIES.READ] = state.user?.permissions
          ? state.user?.permissions[curr.name].includes(ABILITIES.READ)
          : false;
      }

      if (curr.allowWrite) {
        data[ABILITIES.WRITE] = state.user?.permissions
          ? state.user?.permissions[curr.name].includes(ABILITIES.WRITE)
          : false;
      }

      if (curr.allowDelete) {
        data[ABILITIES.DELETE] = state.user?.permissions
          ? state.user?.permissions[curr.name].includes(ABILITIES.DELETE)
          : false;
      }

      return { ...acc, [curr.name]: data };
    }, {}),
  },

  actions: {
    setUserById: ({ commit }, id) => show(id)
      .then(({ data }) => commit('SET_USER', data)),

    setUsersList: ({ commit }) => list()
      .then(({ data }) => commit('SET_USERS', data)),

    createUser: ({ dispatch }, payload) => create(payload)
      .then(() => dispatch('setUsersList')),

    updateUser: ({ dispatch }, payload) => update(payload.id, payload)
      .then(() => dispatch('setUsersList')),

    upsertUser: ({ dispatch, state: { user } }, payload) => (
      user ? dispatch('updateUser', { id: user.id, ...payload }) : dispatch('createUser', payload)
    ),

    setPermissions: ({ commit }, id) => permissions(id)
      .then(({ data }) => commit('SET_PERMISSIONS', data)),

    deleteUserById: ({ commit }, id) => remove(id)
      .then(() => commit('DELETE_USER', id)),

    sendEmailConfirmation: (state, id) => sendEmailConfirmation(id),

    changeLockedState: ({ dispatch }, { id, state }) => changeLockedState(id, state)
      .then(() => dispatch('setUsersList')),

    sort: ({ commit, dispatch }, data) => {
      commit('SET_SORT', data);
      dispatch('setUsersList');
    },
  },

  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },

    DELETE_USER(state, id) {
      state.user = null;
      state.users = state.users.filter((item) => item.id !== id);
    },

    SET_USERS(state, data) {
      state.users = data.sort(sortable(state.sort.key, state.sort.order));
    },

    SET_PERMISSIONS(state, data) {
      state.permissions = data.filter((item) => Object.values(MODULES).includes(item.name));
    },

    SET_LOADING(state, data) {
      state.loading = data;
    },

    SET_SORT(state, data) {
      state.sort = data;
    },
  },
};
