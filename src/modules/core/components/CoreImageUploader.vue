<template>
  <div
    ref="uploadRef"
    class="uk-placeholder uk-text-center"
    :class="{ '--upload': !image, 'uk-dragover': dragging }"
    @dragenter.prevent.stop="dragging = true"
    @dragover.prevent.stop="dragging = true"
    @dragleave.prevent.stop="dragging = false"
    @drop.prevent.stop="onDrop"
  >
    <div class="wrapper" @click="fileInputRef?.$el.click()">
      <div v-show="!image">
        <div>
          <span uk-icon="icon: cloud-upload; ratio: 1.2"></span>
        </div>
        <div class="uk-text-middle hint">{{ $t('core.components.imageUploader.label') }}</div>
        <div><span class="uk-link hint">{{ $t('core.components.imageUploader.select') }}</span></div>
      </div>
      <div v-show="!image">
        <v-field
          ref="fileInputRef"
          class="uk-hidden"
          type="file"
          :name="name"
          rules="image"
          :multiple="false"
          accept="image/*"
          @change="onFileInputChange"
          v-e2e
        />
      </div>
      <div v-show="image" class="preview">
        <button
          class="uk-button uk-button--with-icon uk-button-danger uk-text-uppercase --close"
          type="button"
          @click.stop="onClear"
          v-e2e="'delete'"
        >
          <core-svg :width="16" class="icon" :src="require('@/assets/images/icons/delete.svg')" />
        </button>
        <img class="avatar" :src="image" alt="" />
      </div>
      <div class="overlay uk-animation-fade uk-position-cover"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Field, useField } from 'vee-validate';

export default {
  name: 'CoreImageUploader',
  props: {
    photoUrl: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: 'files',
    },
  },
  components: {
    VField: Field,
  },
  setup(props) {
    const { handleChange } = useField(props.name);

    const uploadRef = ref(null);
    const fileInputRef = ref(null);
    const file = ref(null);
    const dragging = ref(false);
    const image = ref(props.photoUrl);

    const handleFile = (fileObj) => {
      file.value = fileObj;
      image.value = URL.createObjectURL(fileObj);
      handleChange(fileObj);
      fileInputRef.value.$el.value = null;
    };

    const onDrop = (e) => {
      const { files: [fileObj] } = e.dataTransfer;

      dragging.value = false;

      if (fileObj) {
        handleFile(fileObj);
      }
    };

    const onFileInputChange = (e) => {
      const fileObj = e.target.files[0];

      if (fileObj) {
        handleFile(fileObj);
      }
    };

    const onClear = () => {
      image.value = null;
      file.value = null;
      fileInputRef.value.$el.value = null;
      handleChange('');
    };

    return {
      uploadRef,
      fileInputRef,
      image,
      dragging,
      onDrop,
      onFileInputChange,
      onClear,
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
  width: 100%;
  height: 200px;

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
