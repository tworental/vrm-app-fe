<template>
  <core-layout-content>
    <template #header>
      <core-drawer-header>
        <bookings-stepper class="stepper" v-model="currentStep" :steps="steps" />
      </core-drawer-header>
    </template>
    <template #default>
      <keep-alive>
        <component
          :is="stepComponent"
          :booking-id="Number(bookingId)"
          :is-last-step="currentStep === steps.length"
          @next="onNextStep"
          @update="$emit('update')"
        />
      </keep-alive>
    </template>
  </core-layout-content>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import BookingsStepper from '@/modules/bookings/components/BookingsStepper.vue';
import BookingsBookingFormOverview from '@/modules/bookings/components/booking-form/BookingsBookingFormOverview.vue';
import BookingsBookingFormGuests from '@/modules/bookings/components/booking-form/BookingsBookingFormGuests.vue';
import BookingsBookingFormServices from '@/modules/bookings/components/booking-form/BookingsBookingFormServices.vue';
import BookingsBookingFormPayment from '@/modules/bookings/components/booking-form/BookingsBookingFormPayment.vue';

export default {
  components: {
    CoreDrawerHeader,
    BookingsStepper,
    BookingsBookingFormOverview,
    BookingsBookingFormGuests,
    BookingsBookingFormServices,
    BookingsBookingFormPayment,
  },
  emits: ['update'],
  setup(props, { emit }) {
    const i18n = useI18n();
    const store = useStore();
    const route = useRoute();

    const STEPS_COMPONENTS = {
      1: BookingsBookingFormOverview,
      2: BookingsBookingFormGuests,
      3: BookingsBookingFormServices,
      4: BookingsBookingFormPayment,
    };

    const bookingId = ref(null);

    const booking = computed(() => store.state.bookings.entity);

    const steps = computed(() => [
      {
        label: i18n.t('bookings.dicts.formSteps.1'),
        value: 1,
        done: bookingId.value,
        disabled: false,
      },
      {
        label: i18n.t('bookings.dicts.formSteps.2'),
        value: 2,
        done: !!booking.value?.guest,
        disabled: !bookingId.value,
      },
      {
        label: i18n.t('bookings.dicts.formSteps.3'),
        value: 3,
        done: !!booking.value?.guest,
        disabled: !booking.value?.guest,
      },
    ]);

    const currentStep = ref(1);
    const stepComponent = computed(() => STEPS_COMPONENTS[currentStep.value]);

    const goToNextStep = () => {
      if (steps.value[currentStep.value - 1] && !steps.value[currentStep.value - 1].disabled) {
        currentStep.value += 1;
      }
    };

    const onNextStep = (data) => {
      switch (currentStep.value) {
        case 1: {
          // create or update booking
          if (data) {
            bookingId.value = data.id;
          }
          goToNextStep();
          store.dispatch('bookings/refreshEntity', bookingId.value);
          break;
        }
        default:
          goToNextStep();
          store.commit('bookings/SET_AVAILABILITY', null);
          store.dispatch('bookings/refreshEntity', bookingId.value);
          break;
      }

      emit('update', bookingId.value);
    };

    onMounted(() => {
      bookingId.value = route.params.id ? Number(route.params.id) : null;
    });

    onUnmounted(() => {
      store.commit('bookings/SET_AVAILABILITY', null);
    });

    return {
      currentStep,
      steps,
      stepComponent,
      bookingId,

      onNextStep,
    };
  },
};
</script>

<style lang="scss" scoped>
.stepper {
  margin-bottom: -43px;
}
</style>
