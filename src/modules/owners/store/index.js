import sortable from '@/utils/sortable';
import {
  list,
  show,
  create,
  update,
  remove,
  SORT_DEFAULTS, sendEmailConfirmation,
} from '../services';

export default {
  namespaced: true,

  state: {
    owner: null,
    loading: false,
    owners: [],
    sort: SORT_DEFAULTS,
  },

  actions: {
    setOwnerById: ({ commit }, id) => show(id)
      .then(({ data }) => commit('SET_OWNER', data)),

    setOwnersList: ({ commit }) => list()
      .then(({ data }) => commit('SET_OWNERS', data)),

    createOwner: ({ dispatch }, data) => create(data)
      .then(() => dispatch('setOwnersList')),

    updateOwner: ({ dispatch }, data) => update(data.id, data)
      .then(() => dispatch('setOwnersList')),

    upsertOwner: ({ dispatch, state: { owner } }, data) => (
      owner ? dispatch('updateOwner', { ...data, id: owner.id }) : dispatch('createOwner', data)
    ),

    deleteOwnerById: ({ commit }, id) => remove(id)
      .then(() => commit('DELETE_OWNER', id)),

    sort: ({ commit, dispatch }, data) => {
      commit('SET_SORT', data);
      dispatch('setOwnersList');
    },

    sendEmailConfirmation: (state, id) => sendEmailConfirmation(id),
  },

  mutations: {
    SET_OWNER(state, data) {
      state.owner = data;
    },

    DELETE_OWNER(state, id) {
      state.owner = null;
      state.owners = state.owners.filter((item) => item.id !== id);
    },

    SET_OWNERS(state, data) {
      state.owners = data.sort(sortable(state.sort.key, state.sort.order));
    },

    SET_LOADING(state, data) {
      state.loading = data;
    },

    SET_SORT(state, data) {
      state.sort = data;
    },
  },
};
