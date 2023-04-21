<template>
  <div class="uk-flex uk-flex-middle extras-item">
    <div class="uk-flex-1 title uk-flex">
      <div class="extras-item__icon">
        <core-svg
          v-if="tax.frequency === FREQUENCIES.PER_NIGHT"
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
          <strong>{{ tax.name }}</strong>
          <small class="charge-type" v-if="tax.chargeType">
            ({{ $t('settings.dicts.chargeTypes.' + tax.chargeType) }})
          </small>
        </div>
        <div class="uk-flex uk-flex-middle">
          <span class="price">{{ formatCurrency(tax.totalAmountExchanged, tax.currency) }}</span>
          <small v-if="tax.frequency" class="uk-text-lowercase">
            {{ $t('settings.dicts.frequencies.' + tax.frequency) }}
          </small>
        </div>
      </div>
    </div>
    <div class="uk-flex uk-flex-middle">
      <button
        type="button"
        class="uk-button --icon table__action-btn animated-icon"
        v-e2e="'edit-tax'"
        :uk-tooltip="'title: ' + $t('bookings.components.taxItem.edit')"
        @click="$emit('edit', tax.id)"
      >
        <core-svg :width="20" :src="require('@/assets/images/icons/edit.svg')" />
      </button>
      <button
        type="button"
        class="uk-button uk-button-danger --icon table__action-btn animated-icon"
        v-e2e="'delete-tax'"
        :uk-tooltip="'title: ' + $t('bookings.components.taxItem.delete')"
        @click="onDelete(tax.id)"
      >
        <core-svg :width="20" :src="require('@/assets/images/icons/delete.svg')" />
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { computed } from 'vue';
import useKit from '@/modules/core/composables/uikit';
import { formatCurrency } from '@/utils/intl';
import { FREQUENCIES } from '@/modules/settings/services/fees';

export default {
  name: 'BookingsBookingTaxItem',
  props: {
    idx: {
      type: Number,
      default: 0,
    },
    tax: Object,
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();

    const booking = computed(() => store.state.bookings.entity);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('bookings.components.taxItem.deleteConfirm'))
      .then((dialog) => store.dispatch('bookings/extras/delete', { bookingId: booking.value.id, id })
        .then(() => Promise.all([
          store.dispatch('bookings/extras/setList', {
            bookingId: booking.value.id,
          }),
          store.dispatch('bookings/refreshEntity', booking.value.id),
        ]))
        .then(() => uikit.notify('success', i18n.t('bookings.components.taxItem.deleteSuccess')))
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
