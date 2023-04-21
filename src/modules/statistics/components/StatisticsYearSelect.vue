<template>
  <div class="uk-position-relative">
    <div v-if="color" class="circle uk-position-center-left" :style="{ 'background-color': color }"></div>
    <select class="select" :value="modelValue" @change="$emit('update:modelValue', Number($event.target.value))">
      <option
        v-for="year in possibleYears"
        :key="year"
        :value="year"
        :disabled="disabledValue === year"
      >{{ year }}</option>
    </select>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { getPossibleYears } from '@/modules/statistics/utils/years';

export default {
  props: {
    color: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Number,
    },
    disabledValue: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    const store = useStore();

    const possibleYears = computed(() => getPossibleYears(store.state.account.account.createdAt));

    return {
      possibleYears,
    };
  },
};
</script>

<style lang="scss" scoped>
.circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  pointer-events: none;
}
.select {
  background: none;
  border: none;
  outline: none;
  width: 75px;
  padding-left: 17px;
}
</style>
