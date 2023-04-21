import service from '../services';

export default {
  namespaced: true,

  state: {
    list: [],
    entity: null,
    uploading: false,
  },

  actions: {
    setImages: ({ commit }, { propertyId, query }) => service.images.list(propertyId, query)
      .then(({ data }) => commit('SET_IMAGES', data)),

    uploadImages: ({ state, commit }, { propertyId, query, fileList }) => {
      commit('SET_UPLOADING', true);
      const basePosition = state.list.length;

      const promises = Array.from(fileList).map(
        (file, idx) => service.images.create(propertyId, { ...(query || {}), file, position: basePosition + idx })
          .catch(),
      );

      return Promise.all(promises)
        .then(() => commit('SET_UPLOADING', false));
    },

    updateImage: ({ commit }, { propertyId, id, data }) => service.images.update(propertyId, id, data)
      .then(() => commit('UPDATE_IMAGE', { id, ...data })),

    markAsPrimaryImage: ({ commit }, { propertyId, id, data }) => service.images.update(propertyId, id, data)
      .then(() => commit('SET_PRIMARY_IMAGE', { id, ...data })),

    deleteImage: ({ commit }, { propertyId, id }) => service.images.remove(propertyId, id)
      .then(() => commit('DELETE_IMAGE', id)),

    moveImage: (state, {
      propertyId,
      id,
      query,
      body,
    }) => service.images.move(propertyId, id, query, body),
  },

  mutations: {
    SET_IMAGES(state, data) {
      state.list = data;

      if (!state.entity) {
        const [entity] = state.list;
        state.entity = entity;
      }
    },
    SET_IMAGE(state, data) {
      state.entity = data;
    },
    SET_UPLOADING(state, data) {
      state.uploading = data;
    },
    SET_PRIMARY_IMAGE(state, data) {
      state.entity.main = 1;
      state.list = state.list.map((entity) => ({
        ...entity,
        ...(entity.id === data.id ? data : { main: 0 }),
      }));
    },
    UPDATE_IMAGE(state, data) {
      state.entity = {
        ...state.entity,
        ...data,
      };
      state.list = state.list.map((entity) => ({
        ...entity,
        ...(entity.id === data.id ? data : {}),
      }));
    },
    DELETE_IMAGE(state, id) {
      const deletedEntity = state.list.find((entity) => entity.id === id);

      state.list = state.list
        .filter((entity) => entity.id !== id)
        .map((entity) => ({
          ...entity,
          position: entity.position > deletedEntity.position
            ? (entity.position - 1)
            : entity.position,
        }));

      const [entity] = state.list;
      state.entity = entity;
    },
  },
};
