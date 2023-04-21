<template>
  <core-layout-content :displayContent="true" :headerHasMargins="false">
    <template #header>
      <div class="core-layout-content-header storage-sidebar-header">
        <storage-breadcrumbs
          :current-location="drive.location"
          :items="drive.hierarchy"
          :items-count="driveElements"
        />
        <div class="uk-margin-auto-left" v-if="isDriveDirectory">
          <button
            type="button"
            class="uk-button uk-button--has-icon"
            @click="onNewFolder($route.params?.id)"
            v-e2e="'folder-create'"
            v-can:storage.write="loggedUser"
          >
            <core-svg :width="18" :src="require('@/assets/images/icons/folder-add.svg')" />
          </button>

          <storage-upload-btn
            :folder-id="$route.params?.id"
            class="uk-margin-left"
            v-can:storage.write="loggedUser"
          />
        </div>
      </div>
    </template>
    <template #default>
      <storage-upload-dropzone :folder-id="$route.params?.id" :disabled="!isDriveDirectory || !canDownload">
        <ul class="file-list">
          <storage-item
            v-if="$route.params.id"
            :item="{ name: '..' }"
            :isFile="false"
            :description="false"
            :checkboxes="false"
            :actions="false"
            @dragover.stop.prevent
            @dragenter.stop.prevent
            @drop.stop="onDropItem($event, parentFolderId)"
            @click="onClickUpFolder($route.params)"
          />
          <storage-item
            v-for="item in drive.folders"
            :key="item.uuid"
            :item="item"
            :isFile="false"
            :revert-enabled="isBinDirectory"
            :checked="selectedFolders.includes(item.id)"
            :draggable="true"
            @dragover.stop.prevent
            @dragenter.stop.prevent
            @drop.stop="onDropItem($event, item.id)"
            @dragstart.stop="onStartItemDrag($event, item)"
            @click="onClickFolder({ location: $route.params.location, id: item.id })"
            @toggle="onItemChecked(item, $event)"
            @details="onClickItem(item)"
            @revert="onRevertItem(item)"
          />
          <storage-item
            v-for="item in drive.files"
            :key="item.uuid"
            :item="item"
            :isFile="true"
            :revert-enabled="isBinDirectory"
            :checked="selectedFiles.includes(item.id)"
            :draggable="true"
            @dragstart.stop="onStartItemDrag($event, item)"
            @click="onClickFile(item)"
            @toggle="onItemChecked(item, $event)"
            @details="onClickItem(item)"
            @revert="onRevertItem(item)"
          />
          <template v-if="isDriveDirectory">
            <storage-item
              v-for="file in uploadingFiles"
              :key="file.name"
              :item="file"
              :is-file="true"
              :is-loading="true"
              :checkbox-visible="false"
              :actions-visible="false"
              :loading-progress="file.progress"
            />
          </template>
        </ul>
        <template v-if="driveElements === 0 && Object.keys(uploadingFiles).length === 0">
          <core-placeholder
            class="placeholder-wrapper"
            image="files.svg"
            :title="$t('storage.views.drive.placeholder.title')"
            :label="$t('storage.views.drive.placeholder.label')"
            :description="$t('storage.views.drive.placeholder.description')"
          />
        </template>
      </storage-upload-dropzone>
    </template>

    <template #footer>
      <div class="storage-footer uk-flex uk-flex-middle" v-if="driveElements > 0">
        <div class="uk-margin-right">
          <core-form-checkbox
            class="uk-flex-center"
            name="selectAll"
            :label="$t('storage.views.drive.selectAll')"
            :checked="(selectedFiles.length + selectedFolders.length) === driveElements"
            :indeterminate="
              (selectedFiles.length + selectedFolders.length) > 0
               && (selectedFiles.length + selectedFolders.length) < driveElements
            "
            @change="onToggleItems($event)"
          />
        </div>
        <template v-if="selectedFolders.length + selectedFiles.length > 0">
          <div class="uk-badge badge-red uk-margin-right">
            {{ $t('storage.views.drive.selected', { count: selectedFolders.length + selectedFiles.length }) }}
          </div>

          <button
            type="button"
            class="uk-button uk-button--has-icon uk-margin-right"
            v-e2e="'download'"
            @click="onDownloadSelectedItems"
          >
            <core-svg :width="24" :src="require('@/assets/images/icons/download.svg')" />
          </button>

          <button
            type="button"
            class="uk-button uk-button--has-icon"
            v-e2e="'delete'"
            @click="onDeleteSelectedItems"
          >
            <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
          </button>
        </template>
      </div>
    </template>
  </core-layout-content>
  <core-drawer ref="drawerRef">
    <storage-preview />
  </core-drawer>
  <storage-folder-create
    ref="modalRef"
    :folder-id="$route.params?.id || ''"
  />
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { mapActions, useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import FileSaver from 'file-saver';

import { getApiUrl, sanitizeParams } from '@/utils/request';
import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import StorageItem from '@/modules/storage/components/StorageItem.vue';
import StorageFolderCreate from '@/modules/storage/components/StorageFolderCreate.vue';
import StorageUploadBtn from '@/modules/storage/components/StorageUploadBtn.vue';
import StorageUploadDropzone from '@/modules/storage/components/StorageUploadDropzone.vue';
import StoragePreview from '@/modules/storage/components/StoragePreview.vue';
import StorageBreadcrumbs from '@/modules/storage/components/StorageBreadcrumbs.vue';
import { LOCATIONS } from '@/modules/storage/utils/hierarchy';
import { ABILITIES, can, MODULES } from '@/utils/acl';

import { download } from '../services';

export default {
  components: {
    CoreDrawer,
    CoreFormCheckbox,
    StorageFolderCreate,
    StorageItem,
    StorageUploadBtn,
    StorageUploadDropzone,
    StoragePreview,
    StorageBreadcrumbs,
  },
  setup() {
    const uikit = useKit();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const i18n = useI18n();

    const uploadUrl = ref(getApiUrl('storage/files'));
    const drawerRef = ref(null);
    const modalRef = ref(null);

    const parentFolderId = computed(() => {
      const { folderId } = store.state.storage.folders.find(
        (item) => Number(item.id) === Number(route.params?.id),
      ) || {};

      return folderId || '';
    });

    const loggedUser = computed(() => store.state.account.user);
    const uploadingFiles = computed(() => store.state.storage.uploadingFiles);

    const canDownload = computed(() => can(loggedUser.value, MODULES.STORAGE, [ABILITIES.WRITE]));

    const drive = computed(() => store.state.storage.drive);
    const driveElements = computed(() => store.getters['storage/totalElements']);

    const selectedFiles = computed(() => store.state.storage.selected.files || []);
    const selectedFolders = computed(() => store.state.storage.selected.folders || []);

    const isBinDirectory = computed(() => store.getters['storage/isBinDirectory']);
    const isDriveDirectory = computed(() => store.getters['storage/isDriveDirectory']);

    const onStartItemDrag = (event, item) => {
      event.dataTransfer.setData('id', item.id);
      event.dataTransfer.setData('action', item.mimeType ? 'updateFile' : 'updateFolder');
    };

    const onDropItem = (event, folderId) => {
      const id = event.dataTransfer.getData('id');
      const action = event.dataTransfer.getData('action');

      // disallow to drop on itself
      if (action.includes('Folder') && Number(id) === Number(folderId)) {
        return;
      }

      store.dispatch(`storage/${action}`, { id, data: { folderId } })
        .then(() => store.dispatch('storage/getStorage', route.params))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onClickFile = (item) => window.open(item.url, '_target');

    const onClickFolder = (params) => (
      router.push({ name: 'storage-system', params: sanitizeParams(params) })
    );

    const onClickUpFolder = (params) => router.push({
      name: 'storage-system',
      params: sanitizeParams({ ...params, id: parentFolderId.value }),
    });

    const onClickItem = (item) => {
      store.dispatch('storage/getItem', item);

      uikit.drawer.show(drawerRef.value.$el);
    };

    const onItemChecked = (item, checked) => {
      store.dispatch('storage/toggleItem', { item, checked });
    };

    const onToggleItems = (checked) => {
      store.dispatch('storage/toggleItems', checked);
    };

    const onNewFolder = () => uikit.modals.show(modalRef.value.$el);

    const onDeleteSelectedItems = () => {
      const len = selectedFolders.value.length + selectedFiles.value.length;

      if (!len) return;

      const foldersAction = drive.value.location === LOCATIONS.BIN
        ? 'storage/deleteFoldersHard'
        : 'storage/deleteFolders';

      const filesAction = drive.value.location === LOCATIONS.BIN
        ? 'storage/deleteFilesHard'
        : 'storage/deleteFiles';

      uikit.modals.deleteConfirm(i18n.t('storage.views.drive.deleteMessage'))
        .then((dialog) => Promise.all([
          selectedFolders.value.length && store.dispatch(foldersAction, selectedFolders.value),
          selectedFiles.value.length && store.dispatch(filesAction, selectedFiles.value),
        ].filter(Boolean))
          .then(() => store.dispatch('storage/getQuota'))
          .then(() => uikit.notify('success', i18n.t('storage.views.drive.deleteSuccess')))
          .finally(() => dialog.hide()))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onDownloadSelectedItems = async () => {
      try {
        const response = await download(selectedFolders.value, selectedFiles.value);

        FileSaver.saveAs(
          new Blob([response], { type: 'application/zip' }), 'app.zip',
        );
      } catch (error) {
        uikit.notify('danger', error.message);
      }
    };

    const onRevertItem = (item) => {
      console.log('REVERT', item);
    };

    // NOTE: this action is executing when we click on a folder in the Drive List
    onBeforeRouteUpdate(async ({ params }) => {
      await Promise.all([
        store.dispatch('storage/getFiles', {
          deleted: params.location === LOCATIONS.BIN,
        }),
        store.dispatch('storage/getFolders', {
          deleted: params.location === LOCATIONS.BIN,
        }),
      ]);
      return store.dispatch('storage/getStorage', params);
    });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hidden', () => {
        store.commit('storage/SET_PREVIEW');
      });
    });

    return {
      loggedUser,
      canDownload,

      ...mapActions('storage', [
        'getStorage',
      ]),

      uploadingFiles,

      drive,
      driveElements,

      parentFolderId,

      selectedFiles,
      selectedFolders,

      isBinDirectory,
      isDriveDirectory,

      uploadUrl,
      drawerRef,
      modalRef,

      onClickFile,
      onClickItem,
      onItemChecked,
      onClickFolder,
      onClickUpFolder,
      onNewFolder,

      onStartItemDrag,
      onDropItem,
      onDeleteSelectedItems,
      onDownloadSelectedItems,
      onToggleItems,
      onRevertItem,

      // uploadingFiles,
      // folders,
      // showFolderInfo,
      // showFileInfo,
      // onClickFolder,
      // updateFile,
      // onBeforeFilesSend,
      // onFileLoad,
      // onFileLoadStart,
      // onFileLoadEnd,
      // onUploadProgress,
      // onUploadError,
      // onComplete,
      // onCompleteAll,
      // onDownload,
      // selectedCount,
      // toggleFolderSelect,
      // toggleFileSelect,
      // selectedFolders,
      // selectedFiles,
      // selectAllToggle,
      // deleteSelectedItems,
    };
  },
};
</script>

<style lang="scss" scoped>
.storage-sidebar-header {
  border-bottom: 1px solid rgba($base-color-darken, 0.1);
  height: 70px;
}
.file-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.placeholder-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.title {
  font-weight: 500;
  margin: 0;
}

.storage-footer {
  padding: 10px 20px;
  min-height: 62px;
  box-sizing: border-box;
  border-top: 1px solid rgba($base-color-darken, 0.1);
}
</style>
