<template>
  <core-layout-content
    class="uk-position-relative"
    :displayContent="!!rentals.length && !!bookings.length && !!$route.params.id"
    :isLoading="loading || selecting"
  >
    <template #placeholder>
      <div class="booking-placeholder-switcher">
        <bookings-switcher-mode
          value="bookings"
          @change="$event === 'calendar' && $router.push({ name: 'calendar' })"
        />
      </div>

      <core-placeholder
        v-if="rentals.length === 0"
        image="rentals.svg"
        :title="$t('bookings.views.main.rentalPlaceholder.title')"
        :label="$t('bookings.views.main.rentalPlaceholder.label')"
        :description="$t('bookings.views.main.rentalPlaceholder.description')"
      >
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add"
          @click="onAddRental"
          v-e2e="'create-rental'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          {{ $t('bookings.views.main.addRental') }}
        </button>
      </core-placeholder>

      <core-placeholder
        v-else-if="!$route.params.id"
        image="bookings.svg"
        :description="$t('bookings.views.main.reservationsPlaceholder.description')"
      />
    </template>
    <template #header>
      <header class="bookings__header content" v-if="booking">
        <div>
          <h3 class="bookings__name">{{ booking.guest?.fullName || $t('bookings.shared.unknownGuest') }}</h3>
          <p class="bookings__meta">
            {{ $t('bookings.views.main.nights', { num: nights }) }},
            {{ $t('bookings.views.main.guests', { num: guests }) }},
            {{ $t('bookings.views.main.id', { id: booking.id }) }}
          </p>
        </div>
        <bookings-switcher-mode
          value="bookings"
          @change="$event === 'calendar' && $router.push({ name: 'calendar' })"
        />
      </header>
    </template>

    <template #default>
      <router-view />
      <div v-if="selecting" class="uk-overlay-default uk-position-cover">
        <div class="uk-position-center" uk-spinner></div>
      </div>
    </template>
  </core-layout-content>
  <rentals-create ref="modalRef" />
</template>

<script>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import dayjs from '@/utils/dayjs';
import useKit from '@/modules/core/composables/uikit';
import RentalsCreate from '@/modules/rentals/views/RentalsCreate.vue';
import BookingsSwitcherMode from '@/modules/bookings/components/BookingsSwitcherMode.vue';

export default {
  components: {
    RentalsCreate,
    BookingsSwitcherMode,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();

    const modalRef = ref(null);

    const rentals = computed(() => store.state.rentals.rentals.list);
    const bookings = computed(() => store.state.bookings.list);
    const booking = computed(() => store.state.bookings.entity);
    const selecting = computed(() => store.state.bookings.selecting);
    const loading = computed(() => store.state.bookings.loading);

    const nights = computed(() => dayjs(booking.value.dateDeparture, 'YYYY-MM-DD').diff(dayjs(booking.value.dateArrival, 'YYYY-MM-DD'), 'days'));
    const guests = computed(
      () => booking.value.guestsAdults + booking.value.guestsChildren + booking.value.guestsTeens,
    );

    const onAddRental = () => uikit.modals.show(modalRef.value?.$el);

    watch(() => route.params.id, (id) => {
      if (id) {
        store.dispatch('bookings/setEntity', id);
        store.dispatch('bookings/payments/setList', id);
      }
    });

    onMounted(async () => {
      await Promise.all([
        store.dispatch('rentals/rentals/setRentals'),
        store.dispatch('settings/salesChannels/setList'),
        route.params.id && store.dispatch('bookings/setEntity', route.params.id),
        route.params.id && store.dispatch('bookings/payments/setList', route.params.id),
      ]);
    });

    return {
      modalRef,
      rentals,
      bookings,
      booking,
      nights,
      guests,
      selecting,
      loading,

      onAddRental,
    };
  },
};
</script>

<style lang="scss" scoped>
.bookings {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 15px;
  }
  &__name {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 4px;
  }
  &__meta {
    font-size: 0.75rem;
    color: rgba($base-color-darken, 0.5);
    margin: 0;
  }
  &__footer {
    padding: 10px 20px;

    .add-guest {
      color: $primary-color;
      text-transform: uppercase;
    }
  }
}
.booking-placeholder-switcher {
  position: absolute;
  top: 15px;
  right: 30px;
}
</style>
