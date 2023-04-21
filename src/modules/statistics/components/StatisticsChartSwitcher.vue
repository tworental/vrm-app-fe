<template>
  <div class="chart-switcher">
    <button
      class="chart-switcher__btn"
      :class="{ '--selected': modelValue === item.value }"
      v-for="(item, index) in items"
      :key="index"
      @click="item.value !== modelValue && $emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
    },
    modelValue: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style lang="scss" scoped>
.chart-switcher {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  border: 1px solid rgba($alt-color, 0.2);
  border-radius: 4px;

  &__btn {
    background: none;
    outline: none;
    border: none;
    padding: 4px 15px;
    min-width: 90px;
    transition: background-color 0.05s linear;
    cursor: pointer;

    &:hover {
      background-color: darken($color-white, 2%);
    }

    &:active {
      background-color: darken($color-white, 4%);
    }

    &.--selected {
      background-color: $primary-color;
      color: $color-white;

      &:hover {
        background-color: darken($primary-color, 5%);
      }

      &:active {
        background-color: darken($primary-color, 8%);
      }
    }
  }
}
</style>
