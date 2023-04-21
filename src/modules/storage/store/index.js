import { getApiUrl } from '@/utils/request';
import service, { MAX_PROGRESS_VALUE } from '../services';
import {
  LOCATIONS,
  folderItems,
  arrayToHierarchy,
} from '../utils/hierarchy';

export default {
  namespaced: true,

  state: {
    files: [],
    folders: [],
    locations: LOCATIONS,
    preview: null,
    selected: {
      files: [],
      folders: [],
    },
    drive: {
      tags: [],
      files: [],
      folders: [],
      hierarchy: [],
      location: LOCATIONS.DRIVE,
    },
    uploadingFiles: {},
  },

  getters: {
    pinned: (state) => Object.values(state.folders.filter((item) => !!item.pinned)).map((item) => ({
      ...item, location: LOCATIONS.DRIVE,
    })),

    locations: (state) => Object.values(state.locations).map((item) => ({
      key: item,
      icon: item,
      name: ['storage.shared.locations', item].join('.'),
      location: item,
    })),

    totalElements: (state) => state.drive.files.length + state.drive.folders.length,

    totalSelectedItems: (state) => state.selected.files.length + state.selected.folders.length,

    isDriveDirectory: (state) => state.drive.location === LOCATIONS.DRIVE,

    isBinDirectory: (state) => state.drive.location === LOCATIONS.BIN,
  },

  actions: {
    getQuota: ({ commit }) => service.quota()
      .then(({ data }) => commit('SET_QUOTA', data)),

    getFiles: ({ commit, rootState }, params = {}) => service.files.list(params)
      .then(({ data }) => data.map((item) => ({
        url: getApiUrl(`storage/files/${item.uuid}/preview?accessToken=${rootState.auth.accessToken}`),
        ...item,
      })))
      .then((data) => commit('SET_FILES', data)),

    uploadFiles: async ({ commit }, { folderId, fileList }) => {
      const files = Array.from(fileList)
        .map((file) => ({
          file,
          id: `${file.name}_${new Date().getTime()}`,
        }));

      files.forEach((file) => {
        commit('SET_UPLOADING_FILE', {
          file,
          progress: 0,
        });
      });

      await Promise.all(files.map((file) => service.files.create(
        { file: file.file, name: file.file.name, folderId },
        (event) => {
          const progress = Number(Math.min(((event.loaded / event.total) * 100), MAX_PROGRESS_VALUE).toFixed(2));

          commit('SET_UPLOADING_FILE', { file, progress });
        },
      )));

      commit('CLEAR_UPLOADING_FILES');
    },

    updateFile: ({ dispatch }, { id, data }) => service.files.update(id, data)
      .then(() => dispatch('getFiles')),

    deleteFiles: ({ commit }, ids) => service.files.removeMany(ids)
      .then(() => commit('DELETE_FILES', ids)),

    deleteFilesHard: ({ commit }, ids) => service.files.removeManyHard(ids)
      .then(() => commit('DELETE_FILES', ids)),

    getFolders: ({ commit }, params = {}) => service.folders.list(params)
      .then(({ data }) => commit('SET_FOLDERS', data)),

    createFolder: ({ dispatch }, data) => service.folders.create(data)
      .then(() => dispatch('getFolders')),

    updateFolder: ({ dispatch }, { id, data }) => service.folders.update(id, data)
      .then(() => dispatch('getFolders')),

    deleteFolders: ({ commit }, ids) => service.folders.removeMany(ids)
      .then(() => commit('DELETE_FOLDERS', ids)),

    deleteFoldersHard: ({ commit }, ids) => service.folders.removeManyHard(ids)
      .then(() => commit('DELETE_FOLDERS', ids)),

    deleteSelectedItems: ({ state, dispatch }) => Promise.all([
      dispatch('deleteFolders', state.selected.folders),
      dispatch('deleteFiles', state.selected.files),
    ]).then(() => Promise.all([
      dispatch('getFolders'),
      dispatch('getFiles'),
    ])),

    getItem: ({ state, commit }, data) => {
      commit('SET_PREVIEW', state[data.mimeType ? 'files' : 'folders'].find(
        (item) => Number(item.id) === Number(data.id),
      ));
    },

    toggleItem: ({ state, commit }, { item, checked }) => {
      let files = [...state.selected.files];
      let folders = [...state.selected.folders];

      if (item.mimeType) {
        files = checked ? [...files, item.id] : files.filter((id) => id !== item.id);
      } else {
        folders = checked ? [...folders, item.id] : folders.filter((id) => id !== item.id);
      }

      commit('SET_SELECTED', { files, folders });
    },

    toggleItems: ({ state, commit }, checked) => {
      let files = [];
      let folders = [];

      if (checked) {
        files = state.drive.files.map(({ id }) => id);
        folders = state.drive.folders.map(({ id }) => id);
      }

      commit('SET_SELECTED', { files, folders });
    },

    getStorage: ({ state, commit }, { id, location, sort = [] }) => {
      const hierarchy = arrayToHierarchy(id, state.folders);

      // TODO: fix starred files inside the directory.
      const folders = folderItems(location, state.folders, id, sort);
      const files = folderItems(location, state.files, id, sort);

      const labels = [
        ...state.files.map((item) => item.labels),
        ...state.folders.map((item) => item.labels),
      ].flat().filter(Boolean);

      const tags = [...new Map(labels.map((item) => [item.name, item])).values()];

      commit('SET_SELECTED');
      commit('SET_PREVIEW');
      commit('SET_STORAGE', {
        hierarchy, location, folders, files, tags,
      });
    },

    toggleStarredFile: ({ dispatch, commit }, { id, data }) => dispatch('updateFile', { id, data })
      .then(() => commit('SET_PREVIEW_STARRED', data.starred)),

    toggleStarredFolder: ({ dispatch, commit }, { id, data }) => dispatch('updateFolder', { id, data })
      .then(() => commit('SET_PREVIEW_STARRED', data.starred)),

    togglePinnedFolder: ({ dispatch, commit }, { id, data }) => dispatch('updateFolder', { id, data })
      .then(() => commit('SET_PREVIEW_PINNED', data.pinned)),
  },

  mutations: {
    SET_TAGS(state, data) {
      state.tags = data;
    },

    SET_QUOTA(state, data) {
      state.quota = data;
    },

    SET_FILES(state, data) {
      state.files = data;
    },

    SET_FOLDERS(state, data) {
      state.folders = data;
    },

    SET_PREVIEW(state, data) {
      state.preview = data;
    },

    SET_PREVIEW_STARRED(state, data) {
      state.preview.starred = data;
    },

    SET_PREVIEW_PINNED(state, data) {
      state.preview.pinned = data;
    },

    SET_SELECTED(state, data = {}) {
      const { files = [], folders = [] } = data;

      state.selected = { files, folders };
    },

    SET_STORAGE(state, data) {
      const {
        hierarchy = [],
        folders = [],
        files = [],
        tags = [],
        location = LOCATIONS.DRIVE,
      } = data;

      state.drive = {
        hierarchy, folders, files, location, tags,
      };
    },

    SET_UPLOADING_FILE(state, { file, progress }) {
      state.uploadingFiles[file.id] = {
        name: file.file.name,
        size: file.file.size,
        progress,
      };
    },

    CLEAR_UPLOADING_FILES(state) {
      state.uploadingFiles = {};
    },

    DELETE_FOLDERS(state, ids) {
      state.drive.folders = state.drive.folders.filter(
        (item) => !ids.map((id) => Number(id)).includes(Number(item.id)),
      );
      state.folders = state.folders.filter(
        (item) => !ids.map((id) => Number(id)).includes(Number(item.id)),
      );
      state.selected.folders = state.selected.folders.filter(
        (id) => !ids.includes(Number(id)),
      );
    },

    DELETE_FILES(state, ids) {
      state.drive.files = state.drive.files.filter(
        (item) => !ids.map((id) => Number(id)).includes(Number(item.id)),
      );
      state.files = state.files.filter(
        (item) => !ids.map((id) => Number(id)).includes(Number(item.id)),
      );
      state.selected.files = state.selected.files.filter(
        (id) => !ids.includes(Number(id)),
      );
    },
  },
};
