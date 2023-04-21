import { list, update } from '../services';

export default {
  namespaced: true,
  state: {
    list: [],
  },
  actions: {
    setList: ({ commit }) => list()
      .then(({ data }) => commit('SET_LIST', data)),

    update: ({ commit }, { id, data }) => update(id, data)
      .then(() => commit('UPDATE_LIST_ITEM', { id, data })),
  },
  mutations: {
    SET_LIST(state, data) {
      state.list = data;
    },
    UPDATE_LIST_ITEM(state, { id, data }) {
      state.list = state.list.map((item) => ({
        ...item,
        ...(item.id === id ? data : {}),
      }));
    },
  },
  getters: {
    enabled: (state) => state.list.some(({ enabled }) => enabled),
  },
};
