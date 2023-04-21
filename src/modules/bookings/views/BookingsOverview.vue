<template>
  <div class="content" v-if="booking">
    <bookings-booking-info class="uk-margin-bottom" />
    <bookings-payments-table class="uk-margin-bottom" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import BookingsBookingInfo from '@/modules/bookings/components/BookingsBookingInfo.vue';
import BookingsPaymentsTable from '@/modules/bookings/components/payments/BookingsPaymentsTable.vue';

export default {
  components: {
    BookingsBookingInfo,
    BookingsPaymentsTable,
  },
  setup() {
    const store = useStore();

    const booking = computed(() => store.state.bookings.entity);

    return { booking };
  },
};
</script>
