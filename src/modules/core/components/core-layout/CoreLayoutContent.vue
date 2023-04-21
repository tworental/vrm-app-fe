<template>
  <div class="core-layout-content">
    <header class="core-layout-content__header" :class="{ '--no-margin': !headerHasMargins }" v-if="displayContent">
      <slot name="header"></slot>
    </header>
    <div class="core-layout-content__main" :class="{ '--layout-centerd': !displayContent || isLoading }">
      <div v-if="isLoading">
        <div uk-spinner="ratio: 0.75"></div>
      </div>
      <template v-else>
        <slot v-if="displayContent"></slot>
        <slot v-else name="placeholder"></slot>
      </template>
    </div>
    <footer class="core-layout-content__footer" v-if="displayContent">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'CoreLayoutContent',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    displayContent: {
      type: Boolean,
      default: true,
    },
    headerHasMargins: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.core-layout-content {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "CoreLayoutContentHeader"
    "CoreLayoutContentMain"
    "CoreLayoutContentFooter";

  &__header {
    grid-area: CoreLayoutContentHeader;
    margin-bottom: 20px;

    &.--no-margin {
      margin-bottom: 0;
    }
  }
  &__main {
    overflow-y: auto;
    grid-area: CoreLayoutContentMain;

    &.--layout-centerd {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &__footer {
    grid-area: CoreLayoutContentFooter;
  }
}
</style>
