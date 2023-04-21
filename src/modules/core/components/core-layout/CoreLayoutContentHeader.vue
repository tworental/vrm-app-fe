<template>
  <div class="core-layout-content-header">
    <span class="core-layout-content-header__icon">
      <core-svg width="20" :src="require('@/assets/images/icons/' + icon + '.svg')"/>
    </span>
    <h1 class="core-layout-content-header__title">{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CoreLayoutContentHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>
