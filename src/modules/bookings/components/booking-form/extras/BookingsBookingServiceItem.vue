<template>
  <div class="uk-flex uk-flex-middle extras-item">
    <div class="uk-flex-1 title uk-flex">
      <div class="extras-item__icon">
        <core-svg
          v-if="service.type === TIMING_TYPES.EXACT_TIME"
          width="14"
          :src="require('@/assets/images/icons/mini/alarm.svg')"
        />
        <core-svg
          v-else
          width="14"
          :src="require('@/assets/images/icons/mini/calendar.svg')"
        />
      </div>
      <div class="uk-margin-small-left">
        <div class="uk-flex uk-flex-middle">
          <strong>{{ service.name }}</strong>
          <small
            v-if="service.chargeType === CHARGE_TYPES.PER_NIGHT"
            class="charge-type"
          >({{ service.quantity }} x {{ formatCurrency(service.amount, service.currency) }})</small>
        </div>
        <div>
          <span class="price">
            <template v-if="booking.currency === service.currency">
              {{ formatCurrency(service.totalAmountExchanged, service.currency) }}
            </template>
            <template v-else>
              {{ formatCurrency(service.totalAmountExchanged, booking.currency) }}
              ({{ formatCurrency(service.totalAmount, service.currency) }})</template>
          </span>
          <small v-if="service.taxIncluded !== null">({{
              $t('bookings.components.serviceItem.'
                + (service.taxIncluded ? 'vatIncluded' : 'vatExcluded'), { amount: service.taxValue || 0 }
              )
            }})
          </small>
          <small>
            <template v-if="service.type === TIMING_TYPES.EXACT_TIME">
              {{
                $t('bookings.components.serviceItem.date', {
                  date: formatDate(service.startDate, locale, undefined, dateFormat, false)
                })
              }}
              <template v-if="service.startTime">
                {{
                  $t('bookings.components.serviceItem.time', {
                    time: getLocaleTimeFromHHMMSS(service.startTime, locale)
                  })
                }}
              </template>
            </template>
            <template v-else>
              {{ $t('settings.dicts.timing.' + TIMING_TYPES.ALL_STAY) }}
            </template>
          </small>
        </div>
      </div>
    </div>
    <div class="uk-flex uk-flex-middle">
      <button
        type="button"
        class="uk-button uk-button-danger --icon table__action-btn animated-icon"
        v-e2e="'delete-service'"
        :uk-tooltip="'title: ' + $t('bookings.components.serviceItem.delete')"
        @click="onDelete(service.id)"
      >
        <core-svg :width="20" :src="require('@/assets/images/icons/delete.svg')" />
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { formatCurrency, formatDate } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import { getLocaleTimeFromHHMMSS } from '@/utils/datetime';
import { TIMING_TYPES } from '@/modules/settings/services/services';
import { CHARGE_TYPES } from '@/modules/settings/services/fees';

export default {
  name: 'BookingsBookingServiceItem',
  props: {
    idx: {
      type: Number,
      default: 0,
    },
    service: Object,
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();

    const booking = computed(() => store.state.bookings.entity);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('bookings.components.serviceItem.deleteConfirm'))
      .then((dialog) => store.dispatch('bookings/extras/delete', { bookingId: booking.value.id, id })
        .then(() => Promise.all([
          store.dispatch('bookings/extras/setList', {
            bookingId: booking.value.id,
          }),
          store.dispatch('bookings/refreshEntity', booking.value.id),
        ]))
        .then(() => uikit.notify('success', i18n.t('bookings.components.serviceItem.deleteSuccess')))
        .then(() => emit('delete'))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      CHARGE_TYPES,
      TIMING_TYPES,
      locale,
      timezone,
      booking,
      dateFormat,

      formatDate,
      getLocaleTimeFromHHMMSS,
      formatCurrency,
      onDelete,
    };
  },
};
</script>
