<template>
  <div
    class="switcher-mode"
  >
    <input
      id="toggle-on"
      class="toggle toggle-left"
      name="toggle"
      :value="'active'"
      type="radio"
      v-model="current"
      @change="onChange"
    >
    <label
      for="toggle-on"
      class="btn --first"
      :uk-tooltip="'title: ' + $t('rentals.shared.active')"
    >
      <core-svg
        :width="24"
        :src="require('@/assets/images/icons/active.svg')"
      />
    </label>
    <input
      id="toggle-off"
      class="toggle toggle-right"
      name="toggle"
      :value="'expired'"
      type="radio"
      v-model="current"
      @change="onChange"
    >
    <label
      for="toggle-off"
      class="btn"
      :uk-tooltip="'title: ' + $t('rentals.shared.expired')"
    >
      <core-svg
        :width="24"
        :src="require('@/assets/images/icons/expired.svg')"
      />
    </label>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'RentalsSeasonRateSwitcher',
  props: {
    value: String,
  },
  emits: ['change'],
  setup(props, { emit }) {
    const current = ref(props.value);

    const onChange = (event) => {
      emit('change', event.target.value);
    };

    return {
      current,

      onChange,
    };
  },
};
</script>
