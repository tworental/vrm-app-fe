<template>
  <div>
    <button type="button" @click="decrease" v-e2e="'decrease'">-</button>
    <span>{{ counter }}</span>
    <button type="button" @click="increase" v-e2e="'increase'">+</button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'CorePlusMinus',
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1000,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const counter = ref(props.modelValue);

    const decrease = () => {
      if (counter.value > props.min) {
        counter.value -= 1;
      }
    };

    const increase = () => {
      if (counter.value < props.max) {
        counter.value += 1;
      }
    };

    watch(counter, (value) => emit('update:modelValue', value));

    return {
      counter, decrease, increase,
    };
  },
};
</script>
