<template>
  <div class="booking-item" :class="{ '--active': active }">
    <div>
      <h4
        class="booking-item__name --circle"
        :class="booking.status"
      >{{ booking?.guestName || $t('bookings.shared.unknownGuest') }}</h4>
      <p class="booking-item__meta --rental" :class="{ '--deleted': !!booking.propertyUnitTypeUnitDeletedAt }">
        {{ booking.propertyUnitTypeName }}
        <template v-if="booking.multipleUnitTypes">- {{ booking.propertyUnitTypeUnitName }}</template>
      </p>
      <p class="booking-item__meta uk-flex uk-flex-middle uk-text-nowrap">
        <span class="date">{{ formatBookingDate(booking.dateArrival, locale, timezone) }}</span>
        <span class="meta-icons">&bull;</span>
        <span class="uk-flex meta-icons">
          {{ booking.totalNights }}
          <core-svg :width="12" :height="12" :src="require('@/assets/images/icons/nights.svg')" />
        </span>
        <span class="uk-flex meta-icons">
          {{ booking.totalGuests }}
          <core-svg :width="16" :height="16" :src="require('@/assets/images/icons/user.svg')" />
        </span>
      </p>
    </div>
    <div class="uk-flex uk-flex-column uk-flex-between uk-text-right">
      <div class="booking-item__meta booking-item__time">{{ formatTime(booking.dateArrival, locale, timezone) }}</div>
      <div class="booking-item__price">
        {{ formatCurrency(booking.amountTotal, booking.currency || defaultCurrency, locale) }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { formatCurrency, formatBookingDate, formatTime } from '@/utils/intl';

export default {
  name: 'BookingsBookingItem',
  props: {
    active: {
      type: Boolean,
    },
    booking: {
      type: Object,
    },
  },
  setup() {
    const store = useStore();

    const locale = computed(() => store.state.account.account.settings.locale);
    const defaultCurrency = computed(() => store.state.account.account.settings.currency);
    const timezone = computed(() => store.getters['core/timezone']);

    return {
      locale,
      defaultCurrency,
      timezone,

      formatCurrency,
      formatBookingDate,
      formatTime,
    };
  },
};
</script>

<style lang="scss" scoped>
.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 14px 20px 14px 30px;
  border-bottom: 1px solid rgba($alt-color, 0.2);
  border-left: 3px solid transparent;

  &.--active {
    background-color: rgba($alt-color, 0.1);
    border-left-color: $primary-color;
  }

  &__name {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
  }
  &__meta {
    font-size: 0.75rem;
    color: rgba($base-color-darken, 0.5);
    margin: 0;

    &.--rental {
      margin: 2px 0;
      font-weight: 500;
      color: rgba($base-color-darken, 0.7);
    }

    &.--deleted {
      text-decoration: line-through;
    }
  }
  &__price {
    font-size: 0.75rem;
    border: 1px solid rgba($alt-color, 0.3);
    color: $success-color;
    border-radius: 20px;
    padding: 0 5px;
    text-align: center;
  }
  &__time {
    padding-top: 3px;
  }
}
.date {
  padding-right: 4px;
}
.--circle {
  position: relative;

  &::before {
    position: absolute;
    content: '';
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: $primary-color;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
  }

  &.draft {
    &::before {
      background-color: rgba($base-color-darken, 0.2);
    }
  }

  &.confirmed {
    &::before {
      background-color: $success-color;
    }
  }

  &.canceled {
    &::before {
      background-color: $error-color;
    }
  }

  &.declined {
    &::before {
      background-color: $alt-color;
    }
  }
}
.meta-icons {
  margin: 0 2px;
}
</style>
