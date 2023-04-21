<template>
  <div :id="id" uk-offcanvas="overlay: true; bg-close: false; flip: true">
    <div class="uk-offcanvas-bar">
      <button class="uk-offcanvas-close" type="button" uk-close v-e2e="'close'" @click="$emit('close')"></button>
      <div class="uk-offcanvas-bar__wrapper">
        <slot></slot>
        <div v-if="loading" class="uk-offcanvas-bar__loading uk-overlay-default">
          <div uk-spinner></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoreDrawer',
  props: {
    id: {
      type: String,
      default: 'drawer',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
};
</script>
