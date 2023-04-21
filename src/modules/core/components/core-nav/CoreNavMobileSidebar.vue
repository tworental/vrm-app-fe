<template>
  <div ref="sidebar" class="sidebar" uk-offcanvas>
    <div class="uk-offcanvas-bar sidebar-bg">
      <div>
        <button
          class="uk-offcanvas-close"
          type="button"
          uk-close
          v-e2e="'close'"
        ></button>
      </div>
      <ul class="uk-nav">
        <li v-for="(item, index) in menu" :key="index" @click="onLinkClick">
          <router-link
            class="navbar__link uk-text-left"
            :to="item.link"
            v-e2e="'menu-' + item.id"
          >
            <core-svg :width="22" :src="require('@/assets/images/icons/' + item.id + '.svg')" />
            <span class="navbar__link-text">{{ $t('core.components.navMenu.' + item.id) }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  ref,
  computed,
  watch,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';

import useKit from '@/modules/core/composables/uikit';

export default {
  name: 'CoreNavMobileSidebar',
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore();
    const uikit = useKit();

    const sidebar = ref(null);

    const menu = computed(() => store.getters['core/menu']);

    const onLinkClick = () => emit('update:modelValue', false);

    onMounted(() => {
      uikit.drawer.toggle(sidebar.value, props.modelValue);

      uikit.util.on(sidebar.value, 'hidden', () => emit('update:modelValue', false));
    });

    watch(() => props.modelValue, (menuOpened) => {
      uikit.drawer.toggle(sidebar.value, menuOpened);
    });

    return { sidebar, menu, onLinkClick };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 300px;

  &-bg {
    background-color: $base-color-darken;
    box-shadow: 0 4px 4px 0 rgba($color-black, 0.2);
  }

  .uk-offcanvas-close {
    top: 18px;
    right: inherit;
    left: 20px;
    color: $color-white;
  }

  .uk-nav {
    margin-top: 50px;
  }

  .navbar__link {
    color: $color-white;
    padding: 12px 27px;

    &-text {
      padding: 0 20px;
    }

    &.router-link-active {
      color: $primary-color;
    }
  }
}
</style>
