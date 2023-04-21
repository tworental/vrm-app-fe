<template>
  <div v-if="items.length">
    <div class="uk-nav-header uk-margin-small-bottom sidebar-content">{{ label }}</div>

    <ul class="uk-nav uk-nav-default">
      <li class="uk-nav__item" v-for="item in items" :key="item.key || item.id">
        <router-link
          :class="{ 'folder-link--has-action': deletable }"
          :to="{ name: pinned ? 'storage-system-pinned' : 'storage-system', params: routeParams(item) }"
          v-e2e="'shortcut'"
        >
          <span>
            <span class="uk-margin-small-right">
              <core-svg
                :width="14"
                :src="require('@/assets/images/icons/' + (icon || item.icon) + '.svg')"
                :style="styles(item)"
              />
            </span>

            <span>{{ translate ? $t(item.name) : item.name }}</span>
          </span>

          <span v-if="deletable">
            <button
              class="uk-button uk-button--with-icon uk-text-uppercase --transparent --close"
              @click.prevent="$emit('delete', item.id)"
              v-e2e="'delete'"
            >
              <core-svg :width="8" :src="require('@/assets/images/icons/close.svg')" />
            </button>
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { sanitizeParams } from '@/utils/request';

export default {
  name: 'StorageShortcuts',
  props: {
    items: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    deletable: {
      type: Boolean,
      default: false,
    },
    translate: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['delete'],

  setup() {
    const routeParams = ({ location, id }) => sanitizeParams({ location, id });

    const styles = (item) => {
      if (item.color) {
        return { fill: item.color };
      }
      return null;
    };

    return { routeParams, styles };
  },
};
</script>

<style lang="scss" scoped>
.--close {
  display: none;
  padding: 0;
  line-height: 16px;
  height: 16px;
}
.sidebar {
  &-header {
    padding: 15px;
    margin-top: 4px;
    border-bottom: 1px solid rgba($alt-color, 0.4);
  }
  &-content {
    font-size: 0.75rem;
    padding: 0 15px;
    color: rgba($base-color-darken, 0.5);
    opacity: 1;
    text-transform: uppercase;
  }
}
.uk-nav__item {
  a {
    position: relative;
    border-left: 4px solid transparent;
    font-size: 0.75rem;
    padding: 12px 10px 12px 15px;
  }
  .router-link-active {
    background-color: rgba($primary-color, 0.1);
    border-left-color: $primary-color;
    font-weight: 500;
  }

  &:hover {
    .--close {
      display: inline-block;
    }
  }
}
</style>
