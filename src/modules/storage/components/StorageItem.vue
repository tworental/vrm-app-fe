<template>
  <li class="file-item" @click.prevent="$emit('click', item)">
    <div class="file-meta" :class="{ '--no-check': !checkboxes }">
      <div class="file-check" v-if="checkboxes" @click.stop>
        <core-form-checkbox :checked="checked" @change="$emit('toggle', $event)" />
      </div>
      <div class="file-icon" :class="!isFile ? 'folder-icon-wrap' : ''">
        <span v-if="isFile" :class="'fiv-viv fiv-icon-blank fiv-icon-' + (item.ext ? `${item.ext}` : '')"></span>
        <core-svg v-else :width="26" class="folder-icon" :src="require('@/assets/images/icons/folder.svg')" />
      </div>
      <div>
        <div class="file-title">
          <strong>{{ item.name || item.originalFileName }}</strong>
        </div>

        <template v-if="description">
          <template v-if="isLoading">
            <div class="file-description">
              <span>{{ $t('storage.components.listItem.size', { size: prettyBytes(item.size) }) }}</span>
              <progress class="uk-progress" :value="loadingProgress" max="100"></progress>
              <span>{{ loadingProgress }}%</span>
            </div>
          </template>

          <template v-else>
            <div class="file-description" v-if="isFile">
              {{ $t('storage.components.listItem.fileDescription', {
                date: formatDate(item.updatedAt, locale, timezone, dateFormat),
                size: prettyBytes(item.size)
              }) }}
            </div>

            <div class="file-description" v-else>
              {{ $t('storage.components.listItem.folderDescription', {
                elements: item.files,
                date: formatDate(item.updatedAt, locale, timezone, dateFormat),
              }) }}
              <span v-if="item.size">({{ prettyBytes(item.size) }})</span>
            </div>
          </template>
        </template>
      </div>
    </div>

    <div class="file-actions" v-if="actions">
      <button
        type="button"
        v-if="!revertEnabled"
        class="uk-button --icon"
        @click.stop="$emit('details', item)"
        v-e2e="'details'"
      >
        <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
      </button>
      <button
        type="button"
        v-else
        class="uk-button --icon"
        @click.stop="$emit('revert', item)"
        v-e2e="'revert'"
        :uk-tooltip="'title: ' + $t('storage.components.listItem.revert')"
      >
        <core-svg :width="24" :src="require('@/assets/images/icons/revert.svg')" />
      </button>
    </div>
  </li>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import * as prettyBytes from 'pretty-bytes';

import { formatDate } from '@/utils/intl';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';

export default {
  name: 'StorageItem',
  components: {
    CoreFormCheckbox,
  },
  props: {
    item: {
      type: Object,
    },
    isFile: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    description: {
      type: Boolean,
      default: true,
    },
    checkboxes: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Boolean,
      default: true,
    },
    checked: {
      type: Boolean,
    },
    loadingProgress: {
      type: Number,
    },
    revertEnabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click', 'details', 'toggle', 'revert'],

  setup() {
    const store = useStore();

    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    return {
      locale,
      timezone,
      dateFormat,

      formatDate,
      prettyBytes,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~file-icon-vectors/src/scss/file-icon-vivid.scss";

.file {
  &-item {
    border-bottom: 1px solid rgba(map-get($theme-colors , 'alternative'), .2);
    padding: 15px 0;
    cursor: pointer;
    min-height: 48px;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba($alt-color, .05);

      .file-actions {
        display: block;
      }
    }
  }
  &-actions {
    display: none;
    margin-left: auto;
  }
  &-item {
    display: grid;
    grid-template-columns: 1fr 50px;
    align-items: center;
  }
  &-meta {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;

    & > *,
    & > * > * {
      overflow: hidden;
    }

    &.--no-check {
      padding-left: 56px;
    }
  }
  &-check {
    margin: 0 20px;
  }
  &-icon {
    font-size: 30px;
    width: 26px;
    margin-right: 10px;
    text-align: center;
    display: flex;

    .fiv-cla {
      font-size: 26px;
    }
  }
  &-title {
    color: $base-color-darken;
    text-overflow: ellipsis;

    @include toWideMobile {
      font-size: 14px;
    }
  }
  &-description {
    display: flex;
    align-items: center;
    font-size: 0.75rem;

    color: rgba($base-color-darken, 0.7);

    .uk-progress {
      margin: 0 10px;
      width: 180px;
    }
  }
}
.folder-icon {
  &-wrap {
    height: 26px;
    font-size: inherit;
  }
  ::v-deep() path {
    fill: rgb(146, 206, 255);
    stroke: rgb(113, 185, 244);
  }
}
</style>
