<template>
  <div
    ref="uploadRef"
    class="uk-placeholder uk-position-relative uk-text-center --upload"
    :class="{'uk-dragover': dragging }"
    @dragenter.prevent.stop="!disabled ? dragging = true : null"
    @dragover.prevent.stop="!disabled ? dragging = true : null"
    @dragleave.prevent.stop="!disabled ? dragging = false : null"
    @drop.prevent.stop="onDrop"
  >
    <div class="wrapper" @click="!disabled && fileInputRef?.$el.click()">
      <div>
        <div>
          <span uk-icon="icon: cloud-upload; ratio: 2"></span>
        </div>
        <div v-if="!hideText" class="uk-text-middle hint">{{ $t('core.components.imagesUploader.label') }}</div>
        <div v-if="!hideText"><span class="uk-link hint">{{ $t('core.components.imagesUploader.select') }}</span></div>
      </div>
      <div>
        <v-field
          ref="fileInputRef"
          class="uk-hidden"
          type="file"
          :name="name"
          rules="image"
          :multiple="true"
          accept="image/*"
          @change="onFileInputChange"
          v-e2e
        />
      </div>
      <div class="overlay uk-animation-fade uk-position-cover"></div>
    </div>
    <div v-if="loading" class="uk-overlay-default uk-position-cover">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Field, useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as prettyBytes from 'pretty-bytes';

import useKit from '@/modules/core/composables/uikit';
import { createFileList } from '@/utils/files';

export default {
  name: 'CoreImagesUploader',
  props: {
    name: {
      type: String,
      default: 'files',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hideText: {
      type: Boolean,
      default: false,
    },
    maxSingleSize: {
      type: Number,
    },
  },
  components: {
    VField: Field,
  },
  emits: ['filesChange'],
  setup(props, { emit }) {
    const uikit = useKit();
    const i18n = useI18n();

    const { handleChange } = useField(props.name);

    const uploadRef = ref(null);
    const fileInputRef = ref(null);
    const dragging = ref(false);

    const handleFiles = (files) => {
      const filesToUpload = Array.from(files).filter((file) => file.size <= props.maxSingleSize);
      if (filesToUpload.length !== files.length) {
        uikit.notify('danger', i18n.t('core.components.imagesUploader.limitSize', {
          size: prettyBytes(props.maxSingleSize),
        }));
      }

      const fileList = createFileList(filesToUpload);

      handleChange(fileList);
      emit('filesChange', fileList);
    };

    const onDrop = (e) => {
      if (props.disabled) return;

      const { files } = e.dataTransfer;

      dragging.value = false;

      if (files) {
        handleFiles(files);
      }
    };

    const onFileInputChange = (e) => {
      const { files } = e.target;

      if (files) {
        handleFiles(files);
      }
    };

    return {
      uploadRef,
      fileInputRef,
      dragging,
      onDrop,
      onFileInputChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.uk-placeholder {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  background-color: $color-white;

  &.--upload {
    .wrapper {
      padding: 8px;
    }
  }

  .hint {
    font-size: 0.75rem;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
    width: 100%;
    min-height: 150px;
    box-sizing: border-box;
  }

  .overlay {
    border: 1px dashed rgba($alt-color, 0.2);
    pointer-events: none;
    transition: background-color 0.15s ease-in-out;
  }

  &:hover,
  &.uk-dragover {
    box-shadow: none;

    .overlay {
      background-color: rgba($base-color, 0.05);
    }
  }
}
.preview {
  position: relative;
  height: 150px;
  width: 100%;

  .--close {
    opacity: 0;
    position: absolute;
    top: 4px;
    right: 4px;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    padding: 0;
    line-height: unset;
    min-width: unset;
    z-index: 3;
    transition: opacity 0.15s ease-in-out;

    .icon {
      margin: 0;
    }
  }

  &:hover {
    .--close {
      opacity: 1;
    }
  }
}
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;

  &-placeholder {
    width: 120px;
  }
}
.uk-form-custom input[type=file] {
  font-size: inherit;
}
</style>
