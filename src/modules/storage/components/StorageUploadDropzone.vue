<template>
  <div
    ref="uploadRef"
    class="upload-cmp"
    :class="{ 'uk-dragover': isHovered && !disabled }"
    @dragleave.stop
    @drop.prevent="!disabled && onDrop($event)"
    @dragenter.stop
    @dragover.prevent
  >
    <div class="upload-wrapper" :class="{ '--no-events': isHovered && !disabled }">
      <slot></slot>
    </div>

    <div class="upload --no-events">
      <div class="uk-text-center">
        <span class="cloud-icon" uk-icon="icon: cloud-upload; ratio: 3"></span>
        <p>{{ $t('core.components.upload.label') }}</p>
      </div>
    </div>
  </div>
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
  name: 'StorageUploadDropzone',
  props: {
    folderId: String,
    disabled: Boolean,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const i18n = useI18n();
    const uikit = useKit();

    const uploadRef = ref(null);
    const isHovered = ref(false);

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

    const onDrop = async (event) => {
      event.stopPropagation();

      if (event.dataTransfer.files.length) {
        const fileList = getFiles(event.dataTransfer.files);

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

        uikit.notify('success', i18n.t('storage.components.uploadBtn.uploadSuccess'));
      }
    };

    return {
      uploadRef,
      isHovered,

      onDrop,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-cmp {
  position: relative;
  height: 100%;
  overflow-x: hidden;

  .upload {
    position: absolute;
    top: 0;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgba($alt-color, 0.2);
    background-color: rgba($alt-color, 0.05);
    width: 100%;
    height: 100%;
    display: none;

    &-wrapper {
      height: inherit;
      display: flex;
      flex-direction: column;
    }
  }

  .--no-events {
    pointer-events: none;
  }

  &.uk-dragover {
    overflow-y: hidden;

    .upload {
      display: flex;
    }
  }

  input {
    display: none;
  }
}

.file {
  &__item {
    display: flex;
    align-items: center;

    .uk-progress {
      margin: 0;
    }
  }
  &__name {
    margin-right: 20px;
  }
  &__progress {
    min-width: 250px;
  }
}
</style>
