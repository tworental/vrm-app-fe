<template>
  <div class="core-placeholder">
    <core-svg
      class="core-placeholder__figure"
      :height="small ? 80 : 130"
      :src="require('@/assets/images/placeholders/' + image)"
    />
    <h3 class="core-placeholder__title" v-if="title">
      {{ title }}
      <span v-if="label"
        class="core-placeholder__label "
        uk-icon="icon: question; ratio: 0.5"
        :uk-tooltip="'title:' + label + '; pos: right'"></span>
    </h3>
    <p class="core-placeholder__text" v-if="description">{{ description }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CorePlaceholder',
  props: {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.core-placeholder {
  text-align: center;
  color: $alt-color;

  &__title {
    margin: 0;
    color: $alt-color;
    font-size: 14px;
    font-weight: 500;
  }
  &__label {
    color: $primary-color;
    vertical-align: top;
  }
  &__text {
    font-size: 12px;
    margin: 0.5em 0 1.6em;
  }
}
</style>
