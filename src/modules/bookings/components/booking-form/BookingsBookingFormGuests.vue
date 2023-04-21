<template>
  <bookings-booking-form-guest-form
    :booking-id="bookingId"
    :is-last-step="isLastStep"
    @save="$emit('next', $event)"
  />
</template>

<script>
import BookingsBookingFormGuestForm from '@/modules/bookings/components/booking-form/BookingsBookingFormGuestForm.vue';

export default {
  name: 'BookingsBookingFormGuests',
  components: {
    BookingsBookingFormGuestForm,
  },
  props: {
    bookingId: Number,
    isLastStep: Boolean,
  },
  emits: ['next'],
};
</script>
