<template>
  <core-layout-content
    :isLoading="isLoading"
    :displayContent="rentals.length > 0"
    class="uk-position-relative"
  >
    <template #header>
      <core-layout-content-header title="Calendar" icon="calendar">
        <div class="uk-margin-auto-left uk-flex uk-flex-middle">
          <bookings-switcher-mode
            value="calendar"
            @change="$event === 'bookings' && $router.push({ name: 'bookings' })"
          />
        </div>
      </core-layout-content-header>
    </template>

    <template #placeholder>
      <div class="booking-placeholder-switcher">
        <bookings-switcher-mode
          value="calendar"
          @change="$event === 'bookings' && $router.push({ name: 'bookings' })"
        />
      </div>

      <core-placeholder
        image="calendar.svg"
        :title="$t('calendar.views.main.placeholder.title')"
        :label="$t('calendar.views.main.placeholder.label')"
        :description="$t('calendar.views.main.placeholder.description')"
      >
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add"
          v-e2e="'create-rental'"
          @click="onAddRental"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          {{ $t('calendar.views.main.addRental') }}
        </button>
      </core-placeholder>
    </template>

    <template #default>
      <scheduler
        :rentals="rentals"
        :bookings="bookings"
      />
    </template>
  </core-layout-content>
  <rentals-create ref="modalRef" />
</template>

<script>
import {
  computed, onMounted, ref,
} from 'vue';
import { useStore } from 'vuex';

import useKit from '@/modules/core/composables/uikit';
import BookingsSwitcherMode from '@/modules/bookings/components/BookingsSwitcherMode.vue';
import RentalsCreate from '@/modules/rentals/views/RentalsCreate.vue';
import Scheduler from '../components/Scheduler.vue';

export default {
  components: {
    BookingsSwitcherMode,
    RentalsCreate,
    Scheduler,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();

    const modalRef = ref(null);
    const isLoading = ref(true);

    const rentals = computed(() => store.state.calendar.rentals);
    const bookings = computed(() => store.state.calendar.bookings);

    const onAddRental = () => uikit.modals.show(modalRef.value?.$el);

    onMounted(() => {
      Promise.all([
        store.dispatch('rentals/rentals/setRentals'),
        store.dispatch('calendar/setRentals'),
        store.dispatch('calendar/setBookings'),
      ])
        .then(() => { isLoading.value = false; });
    });

    return {
      modalRef,
      rentals,
      bookings,
      isLoading,

      onAddRental,
    };
  },
};
</script>

<style lang="scss">
.booking-placeholder-switcher {
  position: absolute;
  top: 15px;
  right: 30px;
}
</style>
