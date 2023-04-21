<template>
  <div class="uk-alert" :class="'uk-alert-' + className">
    <core-svg
      v-if="icon"
      class="uk-alert__icon"
      height="20"
      :src="require('@/assets/images/icons/' + icon + '.svg')"
    />
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue';

const DEFAULT_TYPE = 'primary';

export default {
  name: 'CoreAlert',
  props: {
    type: {
      type: String,
      default: DEFAULT_TYPE,
    },
    icon: {
      type: String,
    },
    types: {
      type: Array,
      default: () => ['primary', 'success', 'warning', 'danger'],
    },
  },
  setup(props) {
    const className = computed(() => (props.types.includes(props.type) ? props.type : DEFAULT_TYPE));

    return { className };
  },
};
</script>
