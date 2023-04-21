<template>
  <button
    class="sort-btn"
    type="button"
    @click="isAsceding = !isAsceding"
    v-e2e="'sort-' + column"
  >
    <span>{{ label }}</span>
    <span
      class="arrow-up"
      :class="{ 'arrow-up': isAsceding, 'arrow-down': !isAsceding, '--hidden': !arrowVisible }"
      uk-icon="icon: arrow-left"
    ></span>
  </button>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'CoreSorter',
  props: {
    column: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    arrowVisible: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['order'],

  setup(props, { emit }) {
    const isAsceding = ref(false);

    watch(isAsceding, (value) => emit('order', [props.column, value ? 'asc' : 'desc']));

    return { isAsceding };
  },
};
</script>

<style lang="scss" scoped>
.sort-btn {
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  background-color: transparent;
  color: $alt-color;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: inherit;

  &:hover {
    color: darken($alt-color, 10%);
  }
}
.arrow {
  &-up {
    transform: rotate(90deg);
  }
  &-down {
    transform: rotate(270deg);
  }
  &-up,
  &-down {
    &.--hidden {
      opacity: 0;
    }
  }
}
</style>
