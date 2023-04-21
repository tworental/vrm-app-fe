<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cash-network.svg')"
          />
          <h5 class="card__title uk-margin-small-left">{{ $t('bookings.components.paymentsTable.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('bookings.components.paymentsTable.description') }}
        </p>
      </div>
      <div>
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add-from-tablet"
          @click="onAdd"
          :disabled="
            (!(booking.status === BOOKING_STATUSES.DRAFT ||
            booking.status === BOOKING_STATUSES.TENTATIVE ||
            booking.status === BOOKING_STATUSES.CONFIRMED))
          "
          v-can:bookings.write="user"
          v-e2e="'create-payment'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-tablet">{{ $t('bookings.components.paymentsTable.create') }}</span>
        </button>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr class="no-border">
            <th class="table__heading --filled --bordered">
              {{ $t('bookings.components.paymentsTable.amount') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('bookings.components.paymentsTable.paymentType') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('bookings.components.paymentsTable.paymentDate') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('bookings.components.paymentsTable.notes') }}
            </th>
            <th class="table__heading --bordered table__heading--actions --filled">
              {{ $t('bookings.components.paymentsTable.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="(item) in payments" :key="item.id">
            <td class="table__cell">
              {{ formatCurrency(item.amount, item.currency, locale) }}
            </td>
            <td class="table__cell">
              {{ $t('bookings.dicts.paymentTypes.' + item.paymentType) }}
            </td>
            <td class="table__cell">
              {{ formatDate(item.paymentDate, locale, timezone, dateFormat, false) }}
            </td>
            <td class="table__cell">
              {{ item.notes || '-' }}
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
              <div class="actions">
                <template v-if="actionVisible === item.id">
                  <button
                    v-can:bookings.write="user"
                    type="button"
                    v-e2e="'edit-payment'"
                    :uk-tooltip="'title: ' + $t('bookings.components.paymentsTable.edit')"
                    class="uk-button --icon table__action-btn animated-icon"
                    @click="onEdit(item.id)"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </button>
                  <button
                    v-can:bookings.delete="user"
                    @click="onDelete($route.params.id, item.id)"
                    v-e2e="'delete-payment'"
                    :uk-tooltip="'title: ' + $t('bookings.components.paymentsTable.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-can:bookings.write="user"
                  v-else
                  v-e2e="'actions-payment'"
                  @click="actionVisible = item.id"
                  class="uk-button --icon table__action-dots"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
                </button>
                <div v-if="loading === item.id" class="loader table__action-loader" uk-spinner></div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!payments.length">
          <tr class="table__row --footer">
            <td colspan="7" class="table__no-data">
              {{ $t('bookings.components.paymentsTable.noInfo') }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <bookings-payments-modal v-can:bookings.write="user" ref="modalRef" />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import { formatCurrency, formatDate } from '@/utils/intl';
import BookingsPaymentsModal from '@/modules/bookings/components/payments/BookingsPaymentsModal.vue';
import { BOOKING_STATUSES } from '@/modules/bookings/services';

export default {
  components: {
    BookingsPaymentsModal,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const actionVisible = ref(null);
    const loading = ref(null);
    const modalRef = ref(null);

    const payments = computed(() => store.state.bookings.payments.list);
    const locale = computed(() => store.state.account.account.settings.locale);
    const booking = computed(() => store.state.bookings.entity);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const user = computed(() => store.state.account.user);

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);
    const onEdit = (id) => {
      store.dispatch('bookings/payments/setEntity', {
        bookingId: booking.value.id,
        id,
      }).then(() => uikit.modals.show(modalRef.value?.$el));
    };

    const onDelete = (bookingId, id) => uikit.modals.deleteConfirm(i18n.t('bookings.components.paymentsTable.deleteConfirm'))
      .then((dialog) => store.dispatch('bookings/payments/delete', { bookingId, id })
        .then(() => Promise.all([
          store.dispatch('bookings/payments/setList', bookingId),
          store.dispatch('bookings/refreshEntity', bookingId),
        ]))
        .then(() => uikit.notify('success', i18n.t('bookings.components.paymentsTable.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      BOOKING_STATUSES,
      booking,
      payments,
      actionVisible,
      loading,
      modalRef,
      locale,
      timezone,
      dateFormat,
      user,

      onAdd,
      onEdit,
      formatCurrency,
      formatDate,
      onDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;

  &__header {
    padding: 20px;

    @include mediaFrom(760px) {
      display: flex;
      justify-content: space-between;
    }
  }

  &__heading {
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 700;
    color: $base-color-darken;
    margin: 0;
  }

  &__description {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    margin: 0;
  }
}
.description {
  min-height: 100px;
}
.table {
  margin: -20px;

  &__row {
    height: 58px;

    &:last-child {
      border-bottom: none !important;
    }
  }

  &__heading {
    padding-top: 10px;
    padding-bottom: 10px;

    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }

  &__heading,
  &__cell {

    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }

  &__cell {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.actions {
  width: 100px;
}
</style>
