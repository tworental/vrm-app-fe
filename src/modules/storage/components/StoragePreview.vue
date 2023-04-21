<template>
  <v-form
    v-if="item"
    name="preview"
    class="uk-height-1-1"
    @submit="onUpdate"
    v-slot="{ errors }"
    v-e2e
  >
    <core-layout-content :displayContent="true">
      <template #default>
        <core-drawer-content>
          <div class="uk-padding content--bordered">
            <h4 class="preview__name">{{ item.originalFileName || item.name }}</h4>

            <div>
              <p class="preview__meta">
                {{
                  $t('storage.components.drawer.attrs.created', {
                    date: formatDate(item.createdAt, locale, timezone, dateFormat)
                  })
                }}
              </p>
              <p class="preview__meta">
                {{
                  $t('storage.components.drawer.attrs.lastModified', {
                    date: formatDate(item.updatedAt, locale, timezone, dateFormat)
                  })
                }}
              </p>
              <p class="preview__meta">
                {{ $t('storage.components.drawer.attrs.owner', { name: item.owner }) }}
              </p>
              <p class="preview__meta">
                {{ $t('storage.components.drawer.attrs.size', { size: prettyBytes(item.size) }) }}
              </p>
            </div>
          </div>
          <div class="uk-padding content--bordered" v-if="!item.system">
            <template v-if="!isFile">
              <button
                type="button"
                v-if="item?.pinned"
                class="uk-display-block uk-margin-bottom uk-button uk-button-link default-link"
                v-e2e="'unpin'"
                @click="onTogglePinned(false)"
              >
                <core-svg width="18" :src="require('@/assets/images/icons/pin-remove.svg')" />
                <span class="uk-margin-small-left">
                {{ $t('storage.components.drawer.folder.actions.unpin') }}
              </span>
              </button>
              <button
                type="button"
                v-else
                class="uk-display-block uk-margin-bottom uk-button uk-button-link default-link"
                v-e2e="'pin'"
                @click="onTogglePinned(true)"
              >
                <core-svg width="18" :src="require('@/assets/images/icons/pin.svg')" />
                <span class="uk-margin-small-left">
                {{ $t('storage.components.drawer.folder.actions.pin') }}
              </span>
              </button>
            </template>
            <button
              type="button"
              v-if="item?.starred"
              class="uk-display-block uk-margin-bottom uk-button uk-button-link unstar primary-link"
              v-e2e="'unstar'"
              @click="onToggleStarred(false)"
            >
              <core-svg width="18" :src="require('@/assets/images/icons/starred.svg')" />
              <span class="uk-margin-small-left">
                {{ $t('storage.components.drawer.' + (isFile ? 'file' : 'folder') + '.actions.unstar') }}
              </span>
            </button>
            <button
              type="button"
              v-else
              class="uk-display-block uk-margin-bottom uk-button uk-button-link default-link"
              v-e2e="'star'"
              @click="onToggleStarred(true)"
            >
              <core-svg width="18" :src="require('@/assets/images/icons/starred.svg')" />
              <span class="uk-margin-small-left">
                {{ $t('storage.components.drawer.' + (isFile ? 'file' : 'folder') + '.actions.star') }}
              </span>
            </button>
            <button
              type="button"
              class="uk-display-block uk-margin-bottom uk-button uk-button-link"
              @click="onDownload"
              v-e2e="'download'"
            >
              <core-svg width="18" :src="require('@/assets/images/icons/download.svg')" />
              <span class="uk-margin-small-left">
                {{ $t('storage.components.drawer.' + (isFile ? 'file' : 'folder') + '.actions.download') }}
              </span>
            </button>
            <button
              type="button"
              class="uk-display-block uk-button uk-button-link danger-link"
              @click="onDelete"
              v-e2e="'delete'"
            >
              <core-svg width="18" :src="require('@/assets/images/icons/delete.svg')" />
              <span class="uk-margin-small-left">
                {{ $t('storage.components.drawer.' + (isFile ? 'file' : 'folder') + '.actions.delete') }}
              </span>
            </button>
          </div>
          <div class="uk-padding" v-if="!item.system">
            <div class="uk-margin-bottom">
              <label
                class="input-label uk-text-uppercase --required"
                :class="{ '--invalid': errors.title }"
                for="name"
              >
                {{ $t('storage.components.drawer.name') }}
              </label>
              <div class="input-container">
                <v-field
                  id="name"
                  name="title"
                  as="input"
                  class="uk-input --outline"
                  :class="{ '--invalid': errors.title }"
                  rules="required"
                  :value="item.originalFileName || item.name"
                  v-e2e
                />
                <v-error-message class="input-error-message" name="title" />
              </div>
            </div>
            <div class="uk-margin-bottom">
              <label class="input-label uk-text-uppercase" for="moveTo">
                {{ $t('storage.components.drawer.moveTo') }}
              </label>
              <div class="input-container">
                <core-form-tree-select
                  id="moveTo"
                  :nodes="folders"
                  selection-mode="single"
                  name="folderId"
                />
              </div>
            </div>
          </div>
        </core-drawer-content>
      </template>
      <template #footer v-if="!item.system">
        <footer class="uk-padding uk-text-right">
          <button
            type="button"
            class="uk-button uk-button-link uk-margin-right"
            v-e2e
            @click="onCancel"
          >
            {{ $t('storage.components.drawer.cancel') }}
          </button>
          <button
            type="submit"
            class="uk-button uk-button-success"
            v-e2e
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('storage.components.drawer.save') }}
          </button>
        </footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import * as prettyBytes from 'pretty-bytes';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useRoute } from 'vue-router';

import { formatDate } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import { getFoldersTree } from '@/modules/storage/utils/hierarchy';
import CoreFormTreeSelect from '@/modules/core/components/core-form/CoreFormTreeSelect.vue';

export default {
  name: 'StoragePreview',
  components: {
    CoreFormTreeSelect,
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerContent,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const route = useRoute();

    const loading = ref(false);

    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const item = computed(() => store.state.storage.preview);
    const isFile = computed(() => !!store.state.storage.preview.mimeType);
    const folders = computed(() => getFoldersTree(store.state.storage.folders
      .filter((folder) => isFile.value || folder.id !== item.value.id)));
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    const onToggleStarred = (starred) => store.dispatch(`storage/toggleStarred${isFile.value ? 'File' : 'Folder'}`, {
      id: item.value.id,
      data: { starred },
    })
      .then(() => uikit.notify(
        'success',
        i18n.t(`storage.components.drawer.${isFile.value ? 'file' : 'folder'}.${starred ? 'star' : 'unstar'}Success`),
      ))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onTogglePinned = (pinned) => store.dispatch('storage/togglePinnedFolder', {
      id: item.value.id,
      data: { pinned },
    })
      .then(() => uikit.notify(
        'success',
        i18n.t(`storage.components.drawer.${isFile.value ? 'file' : 'folder'}.${pinned ? 'pin' : 'unpin'}Success`),
      ))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onDownload = () => {
      if (isFile.value) {
        window.open(item.value.url, '_target');
      }
    };

    const onUpdate = ({ title: name, folderId }) => {
      const data = { name };

      if (folderId && Object.keys(folderId).length) {
        const [folder] = Object.keys(folderId);
        data.folderId = folder;
      }

      store.dispatch(`storage/update${isFile.value ? 'File' : 'Folder'}`, {
        id: item.value.id,
        data,
      })
        .then(() => uikit.drawer.hide())
        .then(() => store.dispatch('storage/getStorage', route.params))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onDelete = () => {
      uikit.modals.deleteConfirm(i18n.t(`storage.components.drawer.${isFile.value ? 'file' : 'folder'}.delete`))
        .then((dialog) => store.dispatch(`storage/delete${isFile.value ? 'Files' : 'Folders'}`, [item.value.id])
          .then(() => uikit.drawer.hide())
          .then(() => uikit.notify('success', i18n.t(`storage.components.drawer.${isFile.value ? 'file' : 'folder'}.deleteSuccess`)))
          .finally(() => dialog.hide()))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onCancel = () => uikit.drawer.hide();

    return {
      locale,
      timezone,
      loading,
      item,
      folders,
      isFile,
      dateFormat,

      onDownload,
      onUpdate,
      onDelete,
      prettyBytes,
      formatDate,
      onCancel,
      onToggleStarred,
      onTogglePinned,
    };
  },
};
</script>

<style lang="scss" scoped>
.actions {
  text-align: center;

  & > * {
    margin: 0 10px;
  }
}
.preview {
  &__name {
    font-weight: 500;
    color: $base-color-darken;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &__meta {
    color: rgba($base-color-darken, 0.7);
    margin: 0 0 10px;
    font-size: 0.875rem;
  }
}
.content {
  padding: 30px;

  &--bordered {
    border-bottom: 1px solid rgba($alt-color, 0.3);
  }
}
.uk-button-link {
  &.primary-link {
    &,
    &:hover,
    &:focus,
    &:active {
      color: $primary-color;
    }
  }
  &.default-link {
    &,
    &:hover,
    &:focus,
    &:active {
      color: rgba($base-color-darken, 0.7);
    }
  }
  &.danger-link {
    &,
    &:hover,
    &:focus,
    &:active {
      color: $error-color;
    }
  }
}
.folder-preview {
  margin-top: 30px;
  border: 1px solid rgba($base-color, 0.2);
  height: 266px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-content {
  padding: 40px;
}
.unstar ::v-deep() svg path {
  fill: currentColor;
}
</style>
