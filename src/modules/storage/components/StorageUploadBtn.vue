<template>
  <span>
    <button
      type="button"
      class="uk-button uk-button-primary uk-button--add"
      v-e2e="'upload'"
      @click="inputRef.click()"
    >
      <core-svg :width="16" :src="require('@/assets/images/icons/upload.svg')" />
      <span>{{ $t('storage.views.drive.uploadFiles') }}</span>
    </button>
    <input
      ref="inputRef"
      type="file"
      class="uk-hidden"
      multiple
      @change="onFilesChanged($event)"
    />
  </span>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import * as prettyBytes from 'pretty-bytes';
import useKit from '@/modules/core/composables/uikit';
import { createFileList } from '@/utils/files';
import { LIMITS } from '@/utils/acl';

export default {
  name: 'StorageUploadBtn',
  props: {
    uploadUrl: String,
    folderId: String,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const uikit = useKit();
    const i18n = useI18n();

    const inputRef = ref(null);

    const maxSingleSize = computed(() => store.state.core.limits[LIMITS.APP_STORAGE_FILES_MAX_SIZE]);

    const getFiles = (files) => {
      const filesToUpload = Array.from(files).filter((file) => file.size <= maxSingleSize.value);
      if (filesToUpload.length !== files.length) {
        uikit.notify('danger', i18n.t('core.components.imagesUploader.limitSize', {
          size: prettyBytes(maxSingleSize.value),
        }));
      }

      return createFileList(filesToUpload);
    };

    const onFilesChanged = async (e) => {
      const { files } = e.target;

      const fileList = getFiles(files);

      if (!fileList.length) return;

      await store.dispatch('storage/uploadFiles', {
        folderId: props.folderId,
        fileList,
      });

      await Promise.all([
        store.dispatch('storage/getFiles'),
        store.dispatch('storage/getFolders'),
        store.dispatch('storage/getQuota'),
      ]);
      await store.dispatch('storage/getStorage', route.params);

      inputRef.value.value = null;

      uikit.notify('success', i18n.t('storage.components.uploadBtn.uploadSuccess'));
    };

    return { inputRef, onFilesChanged };
  },
};
</script>
