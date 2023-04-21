export default {
  namespaced: true,
  state: {
    steps: [
      {
        id: 1,
        key: 'rental',
        children: ['details', 'location', 'photos', 'rates', 'contactInfo'],
      },
      {
        id: 2,
        key: 'website',
        children: ['assigned', 'domain', 'content', 'published'],
      },
      {
        id: 3,
        key: 'payments',
        children: ['gateway', 'paypal'],
      },
      {
        id: 4,
        key: 'channels',
        children: ['channex'],
      },
    ],
    step: null,
    stepIdx: null,
  },
  actions: {},
  mutations: {
    SET_CURRENT_STEP(state, payload) {
      state.step = state.steps.find((step) => step.key === payload);
    },
    SET_STEP_IDX(state, step) {
      state.stepIdx = step;
    },
  },
  getters: {
    steps(state, _, rootState) {
      return state.steps
        .filter((step) => rootState.account.setupProgress[step.key])
        .map((item, idx) => ({ ...item, id: idx + 1 }));
    },
  },
};
