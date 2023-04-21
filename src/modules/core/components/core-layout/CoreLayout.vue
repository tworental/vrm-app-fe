<template>
  <div
    class="core-skeleton"
    :class="{
      'core-skeleton--core': core,
      '--nav-closed': isNavClosed,
      'nav-layout': hasNav
    }"
  >
    <div class="core-skeleton__bar no-print">
      <slot name="alert"></slot>
    </div>
    <div class="core-skeleton__nav no-print">
      <slot name="nav" :onNavItemClicked="onNavItemClicked"></slot>
    </div>
    <div class="core-skeleton__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CoreLayout',
  props: {
    core: {
      type: Boolean,
      default: false,
    },
    hasNav: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const isNavClosed = computed(() => store.state.core.submenuClosed);

    const onNavItemClicked = () => {
      store.commit('core/SET_SUBMENU_CLOSED', true);
    };

    onMounted(() => {
      store.commit('core/SET_SUBMENU_CLOSED', props.hasNav);
    });

    onUnmounted(() => {
      store.commit('core/SET_SUBMENU_CLOSED', false);
    });

    return {
      isNavClosed,
      onNavItemClicked,
    };
  },
};
</script>

<style lang="scss" scoped>
.core-skeleton {
  height: 100%;
  display: flex;
  flex-direction: column;

  @media all and (min-width: $tablet-screen) {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
    "appBar appBar"
    "appNav appContent";
  }

  &__bar { grid-area: appBar; }
  &__nav {
    grid-area: appNav;
  }
  &__content {
    grid-area: appContent;
    overflow: hidden;
    flex: 1;
  }
  &--core {
    height: 100vh;
  }
}
</style>
