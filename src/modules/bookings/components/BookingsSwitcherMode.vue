<template>
  <div
    v-access="{ limits, name: LIMITS.APP_BOOKINGS_CALENDAR_ENABLED, user }"
    class="switcher-mode"
  >
    <input
      id="toggle-on"
      class="toggle toggle-left"
      name="toggle"
      :value="BOOKING_VIEW_MODES.TABLE"
      type="radio"
      v-model="current"
      @change="onChange"
    >
    <label for="toggle-on" class="btn --first">
      <core-svg
        :width="24"
        :height="24"
        :src="require('@/assets/images/icons/bookings.svg')"
      />
    </label>
    <input
      id="toggle-off"
      class="toggle toggle-right"
      name="toggle"
      :value="BOOKING_VIEW_MODES.CALENDAR"
      type="radio"
      v-model="current"
      @change="onChange"
    >
    <label for="toggle-off" class="btn">
      <core-svg
        :width="24"
        :height="24"
        :src="require('@/assets/images/icons/calendar-check.svg')"
      />
    </label>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import { LIMITS } from '@/utils/acl';
import { BOOKING_VIEW_MODES, setBookingMode } from '@/modules/bookings/utils/filters';

export default {
  name: 'BookingsSwitcherMode',
  props: {
    value: String,
  },
  emits: ['change'],
  setup(props, { emit }) {
    const store = useStore();

    const current = ref(props.value);

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);

    const onChange = (event) => {
      setBookingMode(event.target.value);
      setTimeout(() => {
        emit('change', event.target.value);
      }, 200);
    };

    return {
      LIMITS,
      BOOKING_VIEW_MODES,
      current,
      user,
      limits,

      onChange,
    };
  },
};
</script>
