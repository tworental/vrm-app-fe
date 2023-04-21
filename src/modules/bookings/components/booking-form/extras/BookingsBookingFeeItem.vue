<template>
  <div class="uk-flex uk-flex-middle extras-item">
    <div class="uk-flex-1 title uk-flex">
      <div class="extras-item__icon">
        <core-svg
          v-if="fee.frequency === FREQUENCIES.PER_NIGHT"
          width="14"
          :src="require('@/assets/images/icons/nights.svg')"
        />
        <core-svg
          v-else
          width="14"
          :src="require('@/assets/images/icons/calendar.svg')"
        />
      </div>
      <div class="uk-margin-small-left">
        <div class="uk-flex uk-flex-middle">
          <strong>{{ fee.name }}</strong>
        </div>
        <div>
          <span class="price">{{ formatCurrency(fee.totalAmountExchanged, fee.currency) }}</span>
          <small v-if="fee.taxIncluded !== null">({{
              $t('bookings.components.feeItem.'
              + (fee.taxIncluded ? 'vatIncluded' : 'vatExcluded'), { amount: fee.taxValue || 0 }
              )
            }})
          </small>
          <small v-if="fee.frequency" class="uk-text-lowercase">
            {{ $t('settings.dicts.frequencies.' + fee.frequency) }}
          </small>
        </div>
      </div>
    </div>
    <div class="uk-flex uk-flex-middle">
      <button
        type="button"
        class="uk-button --icon table__action-btn animated-icon"
        v-e2e="'edit-fee'"
        :uk-tooltip="'title: ' + $t('bookings.components.feeItem.edit')"
        @click="$emit('edit', fee.id)"
      >
        <core-svg :width="20" :src="require('@/assets/images/icons/edit.svg')" />
      </button>
      <button
        type="button"
        class="uk-button uk-button-danger --icon table__action-btn animated-icon"
        v-e2e="'delete-fee'"
        :uk-tooltip="'title: ' + $t('bookings.components.feeItem.delete')"
        @click="onDelete(fee.id)"
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

import useKit from '@/modules/core/composables/uikit';
import { formatCurrency } from '@/utils/intl';
import { FREQUENCIES } from '@/modules/settings/services/fees';

export default {
  name: 'BookingsBookingFeeItem',
  props: {
    idx: {
      type: Number,
      default: 0,
    },
    fee: Object,
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();

    const booking = computed(() => store.state.bookings.entity);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('bookings.components.feeItem.deleteConfirm'))
      .then((dialog) => store.dispatch('bookings/extras/delete', { bookingId: booking.value.id, id })
        .then(() => Promise.all([
          store.dispatch('bookings/extras/setList', {
            bookingId: booking.value.id,
          }),
          store.dispatch('bookings/refreshEntity', booking.value.id),
        ]))
        .then(() => uikit.notify('success', i18n.t('bookings.components.feeItem.deleteSuccess')))
        .then(() => emit('delete'))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      FREQUENCIES,

      formatCurrency,
      onDelete,
    };
  },
};
</script>
