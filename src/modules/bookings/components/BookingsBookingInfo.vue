<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/bookings.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('bookings.components.bookingInfo.booking') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('bookings.components.bookingInfo.description') }}
        </p>
      </div>
      <div>
        <button
          v-if="canUserEditBookings || canUserDeleteBookings"
          type="button"
          class="uk-button uk-button-text --icon"
          v-e2e="'booking-menu'"
        >
          <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
        </button>
        <div
          uk-dropdown="mode: click"
          class="dropdown uk-margin-remove-top"
          v-if="canUserEditBookings || canUserDeleteBookings"
        >
          <ul class="uk-dropdown-nav uk-nav-default">
            <li class="uk-dropdown-close" v-can:bookings.write="user">
              <button
                @click="$router.push({ name: 'bookings-overview-edit', params: { id: $route.params.id } })"
                class="uk-nav__link"
                v-e2e="'booking-edit'"
              >
                <core-svg class="icon" width="16" :src="require('@/assets/images/icons/edit.svg')" />
                <span>{{ $t('bookings.views.main.actions.edit') }}</span>
              </button>
            </li>
            <li
              v-can:bookings.delete="user"
              v-if="(booking.status === BOOKING_STATUSES.DRAFT || booking.status === BOOKING_STATUSES.TENTATIVE)"
              class="uk-dropdown-close"
            >
              <button
                @click="onDelete"
                class="uk-nav__link uk-text-danger"
                v-e2e="'booking-delete'"
              >
                <core-svg class="icon" width="16" :src="require('@/assets/images/icons/delete.svg')" />
                <span>{{ $t('bookings.views.main.actions.delete') }}</span>
              </button>
            </li>
            <li
              class="uk-nav-divider invoice-divider"
              v-if="booking.status === BOOKING_STATUSES.CONFIRMED && areInvoicesEnabled"
            ></li>
            <li
              class="uk-dropdown-close"
              v-if="booking.status === BOOKING_STATUSES.CONFIRMED && areInvoicesEnabled"
            >
              <button
                @click="generateInvoice($route.params.id)"
                class="uk-nav__link"
                v-e2e="'booking-generate-invoice'"
              >
                <core-svg class="icon" width="16" :src="require('@/assets/images/icons/download.svg')" />
                <span>{{ $t('bookings.views.main.actions.generateInvoice') }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card__body">
      <div class="card__grid --bordered">
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.property') }}
            </label>
            <div class="card__value">
              {{ booking.propertyName }}
              <router-link
                class="property-link"
                :to="{ name: 'rental-overview', params: { id: booking.propertyId } }"
                :uk-tooltip="'title: ' + $t('bookings.components.bookingInfo.goToProperty')"
                v-e2e="'view-property'"
              >
                <core-svg width="18" height="18" :src="require('@/assets/images/icons/navigation-next.svg')" />
              </router-link>
            </div>
          </div>
        </div>
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.unitType') }}
            </label>
            <div class="card__value">{{ booking.propertyUnitTypeName }}</div>
          </div>
        </div>
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.unit') }}
            </label>
            <div class="card__value">{{ booking.propertyUnitTypeUnitName }}</div>
          </div>
        </div>

        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.status') }}
            </label>
            <div class="card__value">
              <bookings-status-select
                :value="booking.status"
                :booking-id="booking.id"
                class="uk-margin-small-right"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card__grid --bordered">
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateArrival') }}
            </label>
            <div class="card__value">{{ formatDate(booking.dateArrival, locale, timezone, dateFormat) }}</div>
          </div>
        </div>
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateDeparture') }}
            </label>
            <div class="card__value">{{ formatDate(booking.dateDeparture, locale, timezone, dateFormat) }}</div>
          </div>
        </div>
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateConfirmed') }}
            </label>
            <div class="card__value">{{ formatDate(booking.dateConfirmed, locale, timezone, dateFormat) || '-' }}</div>
          </div>
        </div>
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateCanceled') }}
            </label>
            <div class="card__value">{{ formatDate(booking.dateCanceled, locale, timezone, dateFormat) || '-' }}</div>
          </div>
        </div>
        <div>
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateOptionExpiration') }}
            </label>
            <div class="card__value">
              {{ formatDate(booking.optionExpirationDate, locale, timezone, dateFormat) || '-' }}
            </div>
          </div>
        </div>
      </div>

      <div class="card__grid --bordered">
        <div>
          <div>
            <label class="input-label uk-text-uppercase">{{ $t('bookings.components.bookingInfo.guests') }}</label>
            <div>
              <span class="card__value">{{ booking.guestsAdults }}</span>
              {{ $t('bookings.components.bookingInfo.adults') }}
            </div>
            <div>
              <span class="card__value">{{ booking.guestsTeens }}</span>
              {{ $t('bookings.components.bookingInfo.teens') }}
            </div>
            <div>
              <span class="card__value">{{ booking.guestsChildren }}</span>
              {{ $t('bookings.components.bookingInfo.children') }}
            </div>
          </div>
        </div>
        <div v-if="booking.guest">
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.mainGuest') }}
            </label>
            <div>
              {{ booking.guest.title ? capitalizeFirstLetter(booking.guest.title) : '' }}
              <span class="card__value">{{ booking.guest.fullName }}</span>
            </div>
            <div>{{ booking.guest.phoneNumber }} {{ booking.guest.email }}</div>
          </div>
        </div>
        <div v-if="booking.checkinAt">
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateCheckedIn') }}
            </label>
            <div class="card__value">{{ formatDate(booking.checkinAt, locale, timezone, dateFormat) || '-' }}</div>
          </div>
        </div>
        <div v-if="booking.checkoutAt">
          <div>
            <label class="input-label uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.dateCheckedOut') }}
            </label>
            <div class="card__value">{{ formatDate(booking.checkoutAt, locale, timezone, dateFormat) || '-' }}</div>
          </div>
        </div>
        <div v-if="booking.guest && booking.status === BOOKING_STATUSES.CONFIRMED">
          <button
            v-if="!booking.checkinAt"
            type="button"
            class="uk-button uk-button-small uk-button-primary"
            v-e2e="'checkin'"
            @click="onCheckIn"
            :disabled="checkInDisabled || !canUserEditBookings"
            :uk-tooltip="'title:' + (checkInDisabled ? $t('bookings.components.bookingInfo.checkinTooltip', {
              minDate: formatDate(booking.dateArrival, locale, timezone, dateFormat),
              maxDate: formatDate(booking.dateDeparture, locale, timezone, dateFormat),
            }) : '')"
          >
            {{ $t('bookings.components.bookingInfo.checkin') }}
          </button>
          <button
            v-else-if="!booking.checkoutAt"
            type="button"
            class="uk-button uk-button-small uk-button-primary"
            v-e2e="'checkout'"
            :disabled="checkOutDisabled || !canUserEditBookings"
            :uk-tooltip="'title:' + (checkOutDisabled ? $t('bookings.components.bookingInfo.checkoutTooltip', {
              minDate: formatDate(booking.dateArrival, locale, timezone, dateFormat),
              maxDate: formatDate(booking.dateDeparture, locale, timezone, dateFormat),
            }) : '')"
            @click="onCheckOut"
          >
            {{ $t('bookings.components.bookingInfo.checkout') }}
          </button>
        </div>
      </div>

      <div class="card__grid --bordered-dashed --full">
        <div>
          <label class="input-label uk-text-uppercase">
            {{ $t('bookings.components.bookingInfo.notes') }}
          </label>
          <div>{{ booking.notes || '-' }}</div>
        </div>
      </div>

      <div class="card__grid --bordered --filled --flex">
        <div class="summary-block">
          <h5 class="summary-block__title">{{ $t('bookings.components.bookingInfo.paymentDetails') }}</h5>

          <div class="promo-block" v-if="booking.promoCode">
            <div class="promo-block__title">
              {{ $t('bookings.components.bookingInfo.promoCode') }}
            </div>
            <div class="promo-block__badge">{{ booking.promoCode }}</div>
          </div>

          <ul class="summary-block__list">
            <li v-if="booking.channelName" class="uk-flex uk-flex-middle uk-flex-between">
              <div class="summary-block__label">
                {{ $t('bookings.components.bookingInfo.channel') }}
              </div>
              <div class="summary-block__value">
                {{ booking.channelName }} ({{ booking.channelCommission }}%)
              </div>
            </li>
            <li class="uk-flex uk-flex-middle uk-flex-between">
              <div class="summary-block__label">
                {{ $t('bookings.components.bookingInfo.overdue') }}
              </div>
              <div class="summary-block__value">
                {{
                  formatCurrency(
                    (booking.amountTotal || 0),
                    booking.currency || defaultCurrency,
                    locale
                  )
                }}
              </div>
            </li>
            <li class="uk-flex uk-flex-middle uk-flex-between">
              <div class="summary-block__label">
                {{ $t('bookings.components.bookingInfo.paid') }}
              </div>
              <div class="summary-block__value">
                {{ formatCurrency(booking.amountTotalPaid, booking.currency || defaultCurrency, locale) }}
              </div>
            </li>
            <li
              class="uk-flex uk-flex-middle uk-flex-between uk-text-bold"
              :class="{
                'borrow': ((booking.amountTotal - booking.amountTotalPaid) || 0) > 0,
                'paid': ((booking.amountTotal - booking.amountTotalPaid) || 0) <= 0,
              }"
            >
              <div class="summary-block__label">
                {{ $t('bookings.components.bookingInfo.balance') }}
              </div>
              <div class="summary-block__value">
                {{
                  formatCurrency(
                    (booking.amountTotal - booking.amountTotalPaid) || 0,
                    booking.currency || defaultCurrency,
                    locale
                  )
                }}
              </div>
            </li>
          </ul>
        </div>
        <div class="total-block">
          <h4 class="total-block__price">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.accommodation') }}
            </span>
            <span class="total-block__value">
              {{ formatCurrency(booking.amountAccommodationDue, booking.currency || defaultCurrency, locale) }}
            </span>
          </h4>
          <h4 class="total-block__price">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.discount') }}
            </span>
            <span class="total-block__value">
              {{ formatCurrency(booking.amountDiscount, booking.currency || defaultCurrency, locale) }}
            </span>
          </h4>
          <h4 class="total-block__price">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.accommodationTotal') }}
            </span>
            <span class="total-block__value">
              {{
                formatCurrency(
                  booking.amountAccommodationDue - booking.amountDiscount,
                  booking.currency || defaultCurrency,
                  locale,
                )
              }}
            </span>
          </h4>
          <h4 class="total-block__price">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.services') }}
            </span>
            <span class="total-block__value">
              {{
                formatCurrency(
                  (booking.totalServices || 0),
                  booking.currency || defaultCurrency,
                  locale,
                )
              }}
            </span>
          </h4>
          <h4 class="total-block__price">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.feesAndTaxes') }}
            </span>
            <span class="total-block__value">
              {{
                formatCurrency(
                  (booking.totalFees || 0) + (booking.totalTaxes || 0),
                  booking.currency || defaultCurrency,
                  locale,
                )
              }}
            </span>
          </h4>
          <h4 class="total-block__price">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.salesTax') }}
            </span>
            <span class="total-block__value">
              {{ formatCurrency(booking.amountTotalTax, booking.currency || defaultCurrency, locale) }}
            </span>
          </h4>
          <h3 class="total-block__price --total">
            <span class="uk-text-uppercase">
              {{ $t('bookings.components.bookingInfo.total') }}
            </span>
            <span class="total-block__value">
              {{ formatCurrency(booking.amountTotal, booking.currency || defaultCurrency, locale) }}
            </span>
          </h3>
        </div>
      </div>
      <div class="card__content">
        <div class="footer-meta">
          <table class="uk-text-right uk-margin-auto-left">
            <tr>
              <td>
                <div>
                  {{ $t('bookings.components.bookingInfo.accommodationDeposit') }}
                </div>
              </td>
              <td>
                <div class="footer-meta__price">
                  {{
                    formatCurrency(
                      booking.amountSecureDeposited || 0,
                      booking.currency || defaultCurrency,
                      locale,
                    )
                  }} ({{ getPercentByValue(booking.amountSecureDeposited, booking.amountTotal) }}%)
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div>
                  {{ $t('bookings.components.bookingInfo.outstandingAmount') }}
                </div>
              </td>
              <td>
                <div class="footer-meta__price">
                  {{
                    formatCurrency(
                      booking.amountTotal - (booking.amountSecureDeposited || 0),
                      booking.currency || defaultCurrency,
                      locale,
                    )
                  }}
                  ({{
                    getPercentByValue(
                      booking.amountTotal - (booking.amountSecureDeposited || 0),
                      booking.amountTotal
                    )
                  }}%)
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import dayjs from '@/utils/dayjs';
import {
  formatBookingDate,
  formatCurrency,
  formatDate,
  formatDateForInput,
} from '@/utils/intl';
import { capitalizeFirstLetter } from '@/utils/text';
import BookingsStatusSelect from '@/modules/bookings/components/BookingsStatusSelect.vue';
import { getPercentByValue } from '@/utils/number';
import useKit from '@/modules/core/composables/uikit';
import { BOOKING_STATUSES } from '@/modules/bookings/services';
import { getApiUrl } from '@/utils/request';
import {
  ABILITIES,
  can,
  hasAccess,
  LIMITS,
  MODULES,
} from '@/utils/acl';

export default {
  components: {
    BookingsStatusSelect,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const uikit = useKit();
    const i18n = useI18n();

    const booking = computed(() => store.state.bookings.entity);
    const nights = computed(() => dayjs(booking.value.dateDeparture).diff(booking.value.dateArrival, 'days'));

    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);

    const defaultCurrency = computed(() => store.state.account.account.settings.currency);
    const checkInDisabled = computed(() => {
      const now = dayjs().tz(timezone.value);

      return now.isBefore(dayjs.utc(booking.value.dateArrival).tz(timezone.value))
        || now.isAfter(dayjs.utc(booking.value.dateDeparture).tz(timezone.value));
    });

    const checkOutDisabled = computed(() => dayjs().tz(timezone.value)
      .isAfter(dayjs.utc(booking.value.dateDeparture).tz(timezone.value)));
    const areInvoicesEnabled = computed(
      () => hasAccess(store.state.core.limits, LIMITS.APP_DOCUMENTS_INVOICES_ENABLED),
    );

    const user = computed(() => store.state.account.user);
    const canUserEditBookings = computed(() => can(user.value, MODULES.BOOKINGS, [ABILITIES.WRITE]));
    const canUserDeleteBookings = computed(() => can(user.value, MODULES.BOOKINGS, [ABILITIES.DELETE]));

    const onDelete = () => uikit.modals.deleteConfirm(i18n.t('bookings.components.bookingInfo.deleteConfirm'))
      .then((dialog) => store.dispatch('bookings/delete', booking.value.id)
        .then(() => router.push({ name: 'bookings' }))
        .then(() => uikit.notify('success', i18n.t('bookings.components.bookingInfo.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onCheckIn = () => {
      store.dispatch('bookings/update', {
        id: booking.value.id,
        checkinAt: formatDateForInput(new Date(), dayjs().format('HH:mm')),
      })
        .then(() => store.dispatch('bookings/refreshEntity', booking.value.id))
        .then(() => uikit.notify('success', i18n.t('bookings.components.bookingInfo.checkinSuccess')));
    };

    const onCheckOut = () => {
      store.dispatch('bookings/update', {
        id: booking.value.id,
        checkoutAt: formatDateForInput(new Date(), dayjs().format('HH:mm')),
      })
        .then(() => store.dispatch('bookings/refreshEntity', booking.value.id))
        .then(() => uikit.notify('success', i18n.t('bookings.components.bookingInfo.checkoutSuccess')));
    };

    const generateInvoice = (bookingId) => {
      window.open(getApiUrl(`bookings/${bookingId}/invoices/download?accessToken=${store.state.auth.accessToken}`), '_target');
    };

    return {
      BOOKING_STATUSES,
      booking,
      nights,
      locale,
      dateFormat,
      timezone,
      defaultCurrency,
      checkInDisabled,
      checkOutDisabled,
      areInvoicesEnabled,
      canUserEditBookings,
      canUserDeleteBookings,
      user,

      formatBookingDate,
      formatDate,
      formatCurrency,
      capitalizeFirstLetter,
      getPercentByValue,
      onDelete,
      onCheckIn,
      onCheckOut,
      generateInvoice,
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
    border-bottom: 1px solid rgba($alt-color, 0.2);

    @include fromWideMobile {
      display: flex;
      align-items: center;
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

  &__content,
  &__grid {
    padding: 20px;
    font-size: 0.75rem;

    label {
      margin-bottom: 5px;
    }
  }

  &__value {
    font-weight: 500;
  }

  &__grid {
    display: grid;
    grid-gap: 20px;

    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));

    &.--flex {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    &.--full {
      grid-template-columns: 1fr;
    }
  }

  .--filled {
    background-color: rgba($alt-color, 0.04);
  }

  .--bordered {
    border-bottom: 1px solid rgba($alt-color, 0.2);

    &-dashed {
      border-bottom: 1px dashed rgba($base-color-darken, 0.5);
    }
  }
}
.promo-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: $base-color-darken;

  &__title {
    text-transform: uppercase;
  }
  &__badge {
    border: 1px solid rgba($alt-color, 0.2);
    border-radius: 20px;
    background-color: rgba($alt-color, 0.04);
    padding: 3px 8px;
    font-weight: 700;
  }
}
.summary-block {
  min-width: 220px;

  &__list {
    margin: 16px 0 0;
    padding: 0;
    line-height: 24px;
  }
  &__label {
    color: rgba($base-color-darken, 0.7);
  }
  &__title {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    text-align: center;
    margin: 0;
    font-weight: 500;
  }
}
.total-block {
  text-align: right;
  align-self: flex-end;

  &__price {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.325rem;
    font-weight: 500;
    color: rgba($base-color-darken, 0.5);

    &.--total {
      margin-top: 6px;
      font-size: 1rem;
      color: $base-color-darken;
    }
  }
  &__value {
    min-width: 100px;
    flex: 1;
    padding-left: 10px;
  }
}
.footer-meta {
  font-size: 0.875rem;

  &__price {
    min-width: 100px;
    text-align: right;
  }
}
.property-link {
  color: $primary-color;
  margin: 0 7px;
}
.uk-dropdown-nav .uk-nav__link {
  line-height: 1rem;
}
.borrow {
  .summary-block__label,
  .summary-block__value {
    color: $error-color;
  }
}
.paid {
  .summary-block__label,
  .summary-block__value {
    color: $success-color;
  }
}
.invoice-divider {
  margin: 0 -14px;
}
</style>
