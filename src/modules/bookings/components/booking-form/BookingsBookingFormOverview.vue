<template>
  <div class="uk-height-1-1 booking-form">
    <core-layout-content :displayContent="true">
      <template #default>
        <core-drawer-content>
          <div v-if="!loading" class="booking-form__content --bordered">
            <div class="triple-grid uk-margin-small-bottom">
              <core-form-date-range
                :start-date-value="values.dateArrival"
                :end-date-value="values.dateDeparture"
                :errors="errors"
                start-date-key="dateArrival"
                end-date-key="dateDeparture"
                :start-date-label="$t('bookings.views.bookingForm.dateArrival')"
                :end-date-label="$t('bookings.views.bookingForm.dateDeparture')"
                @setValues="setValues({ ...values, ...$event })"
                @change="checkAvailability()"
              />
              <div>
                <core-form-radio-group
                  id="bookingType"
                  name="bookingType"
                  v-e2e="'bookingType'"
                  :value="values.bookingType"
                  :items="bookingTypes"
                  :label="$t('bookings.views.bookingForm.bookingType')"
                  rules="required"
                  class="uk-text-nowrap"
                />
              </div>
            </div>

            <div
              v-if="values.bookingType === 'option'"
              class="option-block"
            >
              <span class="uk-margin-small-right">
                <core-svg
                  :width="16"
                  :src="require('@/assets/images/icons/time-clock.svg')"
                />
              </span>

              <p class="meta uk-margin-remove">
                {{ $t('bookings.views.bookingForm.optionIsActiveUntil') }}
              </p>
              <div
                class="input-container uk-margin-small-left uk-margin-small-right days-left"
                id="optionActiveUntil"
              >
                <core-form-datepicker
                  name="optionExpirationDate"
                  rules="required"
                  :small="true"
                  :min="getMinOptionDate(new Date())"
                  :max="getMaxOptionDate(values.dateArrival)"
                  :value="values?.optionExpirationDate"
                />
              </div>
              <p class="meta uk-margin-remove">
                {{ $t('bookings.views.bookingForm.daysLeft', { num: getLeftDays(values.optionExpirationDate) }) }}
              </p>
            </div>

            <p class="meta uk-margin-top uk-margin-remove-bottom">
              {{ $t('bookings.views.bookingForm.hint') }}
            </p>
          </div>

          <div class="uk-position-relative">
            <div class="booking-form__content --bordered --error">
              <div class="uk-flex uk-margin-small-bottom">
                <core-form-input-number
                  class="people-input"
                  :label="$t('bookings.views.bookingForm.adults')"
                  name="guestsAdults"
                  :value="2"
                  :min="1"
                  :max="100"
                  rules="between:1,100"
                  @input="checkAvailability"
                />

                <core-form-input-number
                  class="people-input"
                  :label="$t('bookings.views.bookingForm.teens')"
                  name="guestsTeens"
                  :value="0"
                  :min="0"
                  :max="100"
                  rules="between:0,100"
                  @input="checkAvailability"
                />

                <core-form-input-number
                  class="people-input"
                  :label="$t('bookings.views.bookingForm.children')"
                  name="guestsChildren"
                  :value="0"
                  :min="0"
                  :max="100"
                  rules="between:0,100"
                  @input="checkAvailability"
                />
              </div>
            </div>

            <div class="booking-form__content --bordered" v-show="!isHotel">
              <div class="grid uk-margin-small-top uk-margin-small-bottom">
                <div>
                  <label for="propertyId" class="input-label" :class="{ '--invalid': errors.propertyId }">
                    {{ $t('bookings.views.bookingForm.property') }}
                  </label>
                  <div class="input-container">
                    <core-form-select
                      id="propertyId"
                      name="propertyId"
                      :class="{ '--invalid': errors.propertyId }"
                      :label="$t('bookings.views.bookingForm.property')"
                      :data="properties"
                      :press-label="false"
                      rules="required"
                      :value="values.propertyId"
                      @update:modelValue="
                        onPropertyChange($event);
                        setValues({ ...values, propertyUnitTypeId: undefined, propertyUnitTypeUnitId: undefined });
                        checkAvailability();
                      "
                    />
                    <v-error-message class="input-error-message" name="propertyId" />
                  </div>
                </div>
                <div v-show="selectedProperty?.multipleUnitTypes">
                  <label
                    for="propertyUnitTypeUnitId" class="input-label"
                    :class="{ '--invalid': errors.propertyUnitTypeId }"
                  >
                    {{ $t('bookings.views.bookingForm.unitType') }}
                  </label>
                  <div class="input-container">
                    <core-form-select
                      id="propertyUnitTypeId"
                      name="propertyUnitTypeId"
                      :class="{ '--invalid': errors.propertyUnitTypeId }"
                      :label="$t('bookings.views.bookingForm.propertyUnitType')"
                      :data="unitTypes"
                      :disabled="!values.propertyId"
                      :press-label="false"
                      rules="required"
                      :value="values.propertyUnitTypeId"
                      @update:modelValue="
                      onPropertyTypeChange(values.propertyId, $event);
                      setValues({ ...values, propertyUnitTypeUnitId: undefined })
                    "
                    />
                    <v-error-message class="input-error-message" name="propertyUnitTypeId" />
                  </div>
                </div>
                <div>
                  <label
                    for="propertyUnitTypeUnitId" class="input-label"
                    :class="{ '--invalid': errors.propertyUnitTypeUnitId }"
                  >
                    {{ $t('bookings.views.bookingForm.unit') }}
                  </label>
                  <div class="input-container">
                    <core-form-select
                      id="propertyUnitTypeUnitId"
                      name="propertyUnitTypeUnitId"
                      :class="{ '--invalid': errors.propertyUnitTypeUnitId }"
                      :label="$t('bookings.views.bookingForm.propertyUnit')"
                      :data="units"
                      rules="required"
                      :disabled="!values.propertyUnitTypeId"
                      :press-label="false"
                      :value="values.propertyUnitTypeUnitId"
                    />
                    <v-error-message class="input-error-message" name="propertyUnitTypeUnitId" />
                  </div>
                </div>
              </div>
            </div>

            <div class="uk-overlay-default uk-position-cover" v-if="!values.dateArrival || !values.dateDeparture"></div>
          </div>

          <div class="uk-position-relative">
            <div class="booking-form__content --error">
              <div class="channel-guests uk-margin-small-top uk-margin-small-bottom">
                <div>
                  <div class="uk-flex uk-flex-bottom uk-width-1-1">
                    <div class="uk-width-1-1">
                      <label
                        for="channelName"
                        class="input-label uk-text-nowrap"
                        :class="{ '--invalid': errors.channelName }"
                      >
                        {{ $t('bookings.views.bookingForm.channelCommission') }}
                      </label>
                      <div class="input-container">
                        <core-form-select
                          id="channelName"
                          name="channelName"
                          :class="{ '--invalid': errors.channelName }"
                          :label="$t('bookings.views.bookingForm.channelCommission')"
                          :data="channelCommissions"
                          :value="values.channelName"
                          :press-label="false"
                          @change="
                            setValues({ ...values, channelCommission: getChannelPercentage($event.target.value) })
                          "
                        />
                        <v-error-message class="input-error-message" name="channelName" />
                      </div>
                    </div>
                    <core-form-input-number
                      class="channel-commission-input uk-text-nowrap"
                      name="channelCommission"
                      :value="0"
                      suffix="%"
                      rules="between:0,100"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ul class="uk-margin-remove" uk-accordion>
                <li
                  class="panel uk-margin-remove"
                >
                  <div class="uk-accordion-title panel__header">
                    <div>
                      <h3 class="panel__title uk-text-uppercase uk-flex uk-flex-middle">
                      <span class="plus-icon">
                        <core-svg
                          height="12"
                          width="12"
                          :src="require('@/assets/images/icons/add-square.svg')"
                        />
                      </span>
                        <span>
                        {{ $t('bookings.views.bookingForm.addNotes') }}
                      </span>
                        <span class="meta-info">
                        {{ $t('bookings.views.bookingForm.optional') }}
                      </span>
                      </h3>
                    </div>

                    <core-svg
                      width="12"
                      class="arrow"
                      :src="require('@/assets/images/icons/arrow-down.svg')"
                    />
                  </div>
                  <div class="uk-accordion-content panel__content uk-margin-remove">
                    <div class="input-container">
                      <v-field
                        id="notes"
                        class="uk-textarea --outline notes"
                        as="textarea"
                        name="notes"
                        :placeholder="$t('bookings.views.bookingForm.notes')"
                        :label="$t('bookings.views.bookingForm.notes')"
                        :class="{ '--invalid': errors.notes }"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="notes" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="booking-form__content --error">
              <div class="uk-flex uk-flex-middle uk-flex-right uk-margin-bottom">
                <div class="input-label uk-margin-small-right">
                  {{ $t('bookings.views.bookingForm.avgPrice') }}
                </div>
                <core-form-input-number
                  class="amount-input uk-margin-small-right"
                  name="avgPrice"
                  :value="0"
                  rules="required|min_value:0"
                  float
                  :currency="currency"
                  @input="onChangeAvgPrice($event)"
                />
                <div class="uk-margin-small-right">
                  <core-svg width="12" :src="require('@/assets/images/icons/close.svg')" />
                </div>
                <div class="uk-margin-small-right uk-flex uk-flex-middle nights-input">
                  <div class="input-container uk-margin-small-right">
                    <input
                      id="nights"
                      type="number"
                      class="uk-input --outline"
                      name="nights"
                      :value="
                        (values.dateDeparture && values.dateArrival)
                         ? getNights(values.dateDeparture, values.dateArrival)
                         : 0
                      "
                      :disabled="true"
                      v-e2e
                    />
                  </div>
                  <div class="input-label">{{ $t('bookings.views.bookingForm.nights') }}</div>
                </div>
                <div class="uk-margin-small-right">
                  &#65309;
                </div>
                <core-form-input-number
                  class="amount-input"
                  name="amountAccommodationDue"
                  :value="0"
                  @input="onChangeTotalAmount($event)"
                  :currency="currency"
                  float
                />
              </div>
              <div class="uk-flex uk-flex-middle uk-flex-right">
                <div class="input-label uk-margin-small-right">
                  {{ $t('bookings.views.bookingForm.discount') }}
                </div>
                <core-form-input-number
                  class="discount-input uk-margin-small-right"
                  name="discountValue"
                  :value="0"
                  :rules="
                    'required|min_value:0'
                     + (values.discountType === CALCULATION_TYPES.PERCENTAGE
                      ? '|max_value:100' : '|max_value:' + (values.amountAccommodationDue || 0) )
                  "
                  @input="onChangeDiscountValue($event)"
                />
                <div class="type-select uk-margin-small-right">
                  <div class="input-container">
                    <core-form-select
                      id="discountType"
                      name="discountType"
                      :class="{ '--invalid': errors.discountType }"
                      :label="$t('bookings.views.bookingForm.discountType')"
                      :value="CALCULATION_TYPES.PERCENTAGE"
                      :data="depositTypes"
                      @change="onChangeDiscountValue()"
                      :press-label="false"
                      :show-placeholder="false"
                    />
                    <v-error-message class="input-error-message" name="discountType" />
                  </div>
                </div>
                <div class="uk-margin-small-right">
                  &#65309;
                </div>
                <core-form-input-number
                  class="amount-input"
                  name="amountDiscount"
                  :value="0"
                  :rules="'max_value:' + values.amountAccommodationDue"
                  :currency="currency"
                  @input="onChangeAmountDiscount($event)"
                  float
                />
              </div>
            </div>
            <div class="booking-form__content booking-form__footer --bordered-dashed --bordered-top">
              <div class="uk-flex uk-flex-middle uk-flex-right">
                <table>
                  <tr>
                    <td>
                      <div class="uk-text-uppercase booking-form__footer-label">
                        {{ $t('bookings.views.bookingForm.accommodationCost') }}
                      </div>
                    </td>
                    <td>
                      <div class="booking-form__footer-label booking-form__footer-price total-price --light">
                        {{ formatCurrency(getAccommodationCost(), currency, locale) }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="uk-text-uppercase booking-form__footer-label">
                        {{ $t('bookings.views.bookingForm.services') }}
                      </div>
                    </td>
                    <td>
                      <div class="booking-form__footer-price total-price --light">
                        {{ formatCurrency(services || 0, currency, locale) }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="uk-text-uppercase booking-form__footer-label">
                        {{ $t('bookings.views.bookingForm.feesAndTaxes') }}
                      </div>
                    </td>
                    <td>
                      <div class="booking-form__footer-price total-price --light">
                        {{ formatCurrency(feesAndTaxes || 0, currency, locale) }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="uk-text-uppercase booking-form__footer-label">
                        {{ $t('bookings.views.bookingForm.tax') }}
                      </div>
                    </td>
                    <td>
                      <div class="booking-form__footer-price total-price --light">
                        {{ formatCurrency(amountTotalTax || 0, currency, locale) }}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="booking-form__content --error booking-form__footer --bordered">
              <div class="uk-margin-bottom booking-form__footer-label">
                <h3 class="total-price">
                <span class="uk-text-uppercase">
                  {{ $t('bookings.views.bookingForm.total') }}
                </span>
                  <span class="booking-form__footer-price">
                    {{ formatCurrency(getTotalPrice(), currency, locale) }}
                  </span>
                </h3>
              </div>
              <div>
                <div class="uk-flex uk-flex-middle uk-flex-right">
                  <div class="input-label uk-margin-small-right">
                    {{ $t('bookings.views.bookingForm.accommodationDeposit') }}
                  </div>
                  <core-form-input-number
                    class="amount-input uk-margin-small-right"
                    name="depositValue"
                    :rules="'required|min_value:0' +
                      (values.accommodationDepositType === CALCULATION_TYPES.PERCENTAGE
                       ? '|max_value:100' : '|max_value:' + getTotalPrice() )"
                    :value="0"
                  />
                  <div class="type-select">
                    <div class="input-container">
                      <core-form-select
                        id="accommodationDepositType"
                        name="accommodationDepositType"
                        :class="{ '--invalid': errors.accommodationDepositType }"
                        :label="$t('bookings.views.bookingForm.accommodationDepositType')"
                        :value="CALCULATION_TYPES.PERCENTAGE"
                        :data="depositTypes"
                        :press-label="false"
                        :show-placeholder="false"
                      />
                      <v-error-message class="input-error-message" name="accommodationDepositType" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="booking-form__content booking-form__footer">
              <table class="booking-form__footer-label uk-margin-auto-left">
                <tr>
                  <td>
                    <div>
                      {{ $t('bookings.views.bookingForm.accommodationDeposit') }}
                    </div>
                  </td>
                  <td>
                    <div class="booking-form__footer-price">
                      {{ formatCurrency(getAccommodationDeposit(), currency, locale) }}
                      ({{ values.accommodationDepositType === CALCULATION_TYPES.PERCENTAGE
                      ? values.depositValue
                      : getPercentByValue(getAccommodationDeposit(), getTotalPrice())
                      }}%)
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      {{ $t('bookings.views.bookingForm.outstandingAmount') }}
                    </div>
                  </td>
                  <td>
                    <div class="booking-form__footer-price">
                      {{ formatCurrency(getOutstandingAmount(), currency, locale) }}
                      ({{ values.accommodationDepositType === CALCULATION_TYPES.PERCENTAGE
                      ? (100 - values.depositValue)
                      : getPercentByValue(getOutstandingAmount(), getTotalPrice())
                      }}%)
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <div class="uk-overlay-default uk-position-cover" v-if="!canBeEdited"></div>
          </div>
        </core-drawer-content>
      </template>

      <template #footer>
        <div
          class="
            booking-form__content booking-form__footer uk-text-right --bordered-top uk-flex uk-flex-middle uk-flex-right
          "
        >
          <button
            v-if="booking"
            type="button"
            class="uk-button uk-button-danger --icon table__action-btn animated-icon uk-margin-auto-right"
            v-e2e="'delete-booking'"
            :uk-tooltip="'title: ' + $t('bookings.views.bookingForm.delete')"
            @click="onDelete"
          >
            <core-svg :width="20" :src="require('@/assets/images/icons/delete.svg')" />
          </button>
          <button
            type="button"
            class="uk-button uk-button-link uk-margin-right"
            v-e2e="'cancel-booking'"
            @click="onClose"
          >
            {{ $t('bookings.views.bookingForm.cancel') }}
          </button>
          <button
            v-e2e="'booking'"
            type="submit"
            :disabled="!canBeEdited"
            class="uk-button uk-button-success"
            @click="handleSubmitClick({ validate, onSubmit })"
          >
            {{ $t('bookings.shared.' + (isLastStep ? 'saveAndClose' : 'saveAndNext')) }}
          </button>
        </div>
      </template>
    </core-layout-content>
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import dayjs from '@/utils/dayjs';
import { hasAccess, LIMITS } from '@/utils/acl';
import { handleSubmitClick, scrollToFirstInvalidControl } from '@/utils/form';
import { formatCurrency, formatDateForInput, getLocalTimeByUTC } from '@/utils/intl';
import { isInputDateValid } from '@/utils/datetime';
import { getAverageValue, getPercentByValue, getValueByPercent } from '@/utils/number';
import { BOOKING_TYPES, CALCULATION_TYPES } from '@/modules/bookings/services';
import useKit from '@/modules/core/composables/uikit';
import { getNights } from '@/modules/bookings/utils/date';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
import CoreFormDateRange from '@/modules/core/components/core-form/CoreFormDateRange.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import { setTimeForDate } from '@/modules/calendar/utils/datetime';

export default {
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormDateRange,
    CoreDrawerContent,
    CoreFormSelect,
    CoreFormRadioGroup,
    CoreFormDatepicker,
    CoreFormInputNumber,
  },
  props: {
    isLastStep: Boolean,
  },
  emits: ['next', 'update'],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const {
      errors: formErrors,
      values: formValues,
      validate,
      setValues,
      handleSubmit,
      resetForm,
    } = useForm({
      initialValues: {
        bookingType: BOOKING_TYPES.CONFIRMED,
      },
    });

    const bookingTypes = Object.values(BOOKING_TYPES).map((type) => ({
      label: i18n.t(`bookings.dicts.types.${type}`),
      value: type,
    }));

    const booking = computed(() => store.state.bookings.entity);
    const isHotel = computed(() => hasAccess(store.state.core.limits, LIMITS.APP_PROPERTIES_HOTEL_MODE_ENABLED));

    const amountTotalTax = ref(null);
    const loading = ref(true);
    const selectedProperty = ref(null);

    const availability = computed(() => store.state.bookings.availability);
    const timezone = computed(() => store.getters['core/timezone']);
    const properties = computed(() => store.getters['rentals/rentals/autocompleteList']);
    const unitTypes = computed(() => store.getters['rentals/rentalTypes/autocompleteList'].map((unitType) => {
      const currentAvailability = availability.value?.find((item) => item.unitTypeId === unitType.value);
      return {
        ...unitType,
        disabled: currentAvailability && !currentAvailability.unitTypeCompleted,
      };
    }));
    const units = computed(() => store.getters['rentals/units/autocompleteList'].map((unit) => {
      const currentAvailability = availability.value?.find((item) => item.id === unit.value);
      return {
        ...unit,
        disabled: currentAvailability && !currentAvailability.availability,
      };
    }));
    const channelCommissions = computed(
      () => store.state.settings.salesChannels.list
        .map((channel) => ({
          label: channel.name,
          value: channel.name,
        }))
        .concat({
          label: i18n.t('bookings.views.bookingForm.custom'),
          value: i18n.t('bookings.views.bookingForm.custom'),
        }),
    );
    const locale = computed(() => store.state.account.account.settings.locale);
    const selectedRate = computed(
      () => availability.value?.find(({ id }) => id === Number(formValues.propertyUnitTypeUnitId)),
    );

    const currency = computed(
      () => selectedRate.value?.availability?.currency || store.state.account.account.settings.currency,
    );

    const services = computed(() => {
      if (selectedRate.value && selectedRate.value.availability) {
        return selectedRate.value.availability.totalServices || 0;
      }

      if (booking.value) {
        return booking.value.totalServices;
      }

      return null;
    });

    const feesAndTaxes = computed(() => {
      if (selectedRate.value && selectedRate.value.availability) {
        return selectedRate.value.availability.totalFees + selectedRate.value.availability.totalTaxes;
      }

      if (booking.value) {
        return booking.value.totalFees + booking.value.totalTaxes;
      }

      return null;
    });

    const canBeEdited = computed(
      () => (
        formValues.dateArrival
          && formValues.dateDeparture
          && (formValues.guestsAdults || formValues.guestsChildren || formValues.guestsTeens)
          && formValues.propertyId
          && formValues.propertyUnitTypeId
          && formValues.propertyUnitTypeUnitId
          && (availability.value === null || (selectedRate.value && selectedRate.value.availability))
      ),
    );

    const depositTypes = computed(() => [
      {
        label: '%',
        value: CALCULATION_TYPES.PERCENTAGE,
      },
      {
        label: currency.value,
        value: CALCULATION_TYPES.FIXED,
      },
    ]);

    const getChannelPercentage = (name) => {
      const channelSales = store.state.settings.salesChannels.list.find((channel) => channel.name === name);

      return channelSales?.commission || 0;
    };

    const getLeftDays = (date) => (date ? dayjs(date, 'YYYY-MM-DD')
      .diff(dayjs(), 'days') + 1 : 0);

    const onPropertyTypeChange = (propertyId, propertyUnitTypeId) => {
      if (propertyId && propertyUnitTypeId) {
        return store.dispatch('rentals/units/setUnits', {
          propertyId,
          propertyUnitTypeId,
        });
      }

      return Promise.resolve(store.commit('rentals/units/SET_UNITS', []));
    };

    const onPropertyChange = (propertyId) => {
      if (propertyId) {
        selectedProperty.value = properties.value.find(({ value }) => value === Number(propertyId));

        return store.dispatch('rentals/rentalTypes/setRentalTypes', propertyId)
          .then(() => {
            if (selectedProperty.value && !selectedProperty.value.multipleUnitTypes) {
              setValues({ ...formValues, propertyUnitTypeId: unitTypes.value[0].value });
              onPropertyTypeChange(propertyId, unitTypes.value[0].value);
            }
          });
      }

      selectedProperty.value = null;

      return Promise.resolve(store.commit('rentals/rentalTypes/SET_RENTAL_TYPES', []));
    };

    const getDiscountAmount = (amountAccommodationDue) => {
      if (formValues.discountType === CALCULATION_TYPES.PERCENTAGE) {
        return getValueByPercent(formValues.discountValue, amountAccommodationDue);
      }

      return formValues.discountValue;
    };

    const onChangeAvgPrice = (price) => {
      const amountAccommodationDue = Number(price) * getNights(formValues.dateDeparture, formValues.dateArrival);
      const amountDiscount = getDiscountAmount(amountAccommodationDue);

      setValues({ ...formValues, amountAccommodationDue, amountDiscount });
    };

    const getAvgPrice = (price, nights) => Number((Number(price) / nights)
      .toFixed(2));

    const onChangeTotalAmount = (price) => {
      setValues({
        ...formValues,
        avgPrice: getAvgPrice(price, getNights(formValues.dateDeparture, formValues.dateArrival)),
        amountDiscount: getDiscountAmount(Number(price)),
      });
    };

    const onChangeDiscountValue = () => {
      const amountDiscount = getDiscountAmount(formValues.amountAccommodationDue);
      setValues({ ...formValues, amountDiscount });
    };

    const onChangeAmountDiscount = (amountDiscount) => {
      let discountValue;
      if (formValues.discountType === CALCULATION_TYPES.PERCENTAGE) {
        discountValue = getPercentByValue(amountDiscount, formValues.amountAccommodationDue);
      } else {
        discountValue = amountDiscount;
      }

      setValues({ ...formValues, discountValue });
    };

    const getAccommodationCost = () => (formValues.amountAccommodationDue || 0) - (formValues.amountDiscount || 0);

    const getTax = () => selectedRate.value?.availability?.taxValue || 0;

    const getTotalPrice = () => {
      const cost = getAccommodationCost() + services.value + feesAndTaxes.value;

      if (selectedRate.value?.availability?.taxEnabled) {
        return cost + getTax();
      }

      if (amountTotalTax.value) {
        return cost + amountTotalTax.value;
      }

      return cost;
    };

    const getAccommodationDeposit = () => {
      if (formValues.accommodationDepositType === CALCULATION_TYPES.PERCENTAGE) {
        return getValueByPercent(formValues.depositValue, getTotalPrice());
      }

      return formValues.depositValue;
    };

    const getOutstandingAmount = () => {
      const total = getTotalPrice();

      return total - getAccommodationDeposit();
    };

    onMounted(async () => {
      if (route.params.id) {
        await store.dispatch('bookings/setEntity', route.params.id);

        Promise.all([
          onPropertyChange(booking.value.propertyId),
          onPropertyTypeChange(booking.value.propertyId, booking.value.propertyUnitTypeId),
        ])
          .then(() => {
            resetForm({
              values: {
                ...booking.value,
                dateArrival: formatDateForInput(booking.value.dateArrival),
                dateDeparture: formatDateForInput(booking.value.dateDeparture),
                avgPrice: getAvgPrice(
                  booking.value.amountAccommodationDue,
                  getNights(
                    formatDateForInput(booking.value.dateDeparture),
                    formatDateForInput(booking.value.dateArrival),
                  ),
                ),
                discountValue: getPercentByValue(booking.value.amountDiscount, booking.value.amountAccommodationDue),
                optionExpirationDate: formatDateForInput(booking.value.optionExpirationDate),
                depositValue: getPercentByValue(booking.value.amountSecureDeposited, booking.value.amountTotal),
                bookingType: booking.value.optionExpirationDate ? BOOKING_TYPES.OPTION : BOOKING_TYPES.CONFIRMED,
              },
            });

            amountTotalTax.value = booking.value.amountTotalTax;
          })
          .finally(() => { loading.value = false; });
      } else if (store.getters['calendar/isCreateMode']) {
        const {
          propertyId,
          propertyUnitTypeId,
          propertyUnitTypeUnitId,
          dateArrival,
          dateDeparture,
        } = store.state.calendar.creationParams;

        Promise.all([
          onPropertyChange(propertyId),
          onPropertyTypeChange(propertyId, propertyUnitTypeId),
        ])
          .then(() => resetForm({
            values: {
              propertyId,
              propertyUnitTypeId,
              propertyUnitTypeUnitId,
              dateArrival,
              dateDeparture,
              bookingType: BOOKING_TYPES.CONFIRMED,
            },
          }))
          .finally(() => { loading.value = false; });
      } else if (isHotel.value) {
        onPropertyChange(properties.value[0].value)
          .then(() => onPropertyTypeChange(properties.value[0].value, unitTypes.value[0].value))
          .then(() => resetForm({
            values: {
              propertyId: properties.value[0].value,
              propertyUnitTypeId: unitTypes.value[0].value,
              propertyUnitTypeUnitId: units.value[0].value,
              bookingType: BOOKING_TYPES.CONFIRMED,
            },
          }))
          .then(() => { loading.value = false; });
      } else {
        loading.value = false;
      }
    });

    const checkAvailability = () => {
      if (formValues.dateArrival
        && formValues.dateDeparture
        && formValues.propertyId
        && isInputDateValid(formValues.dateArrival)
        && isInputDateValid(formValues.dateDeparture)
      ) {
        const guests = Number(formValues.guestsChildren || 0)
          + Number(formValues.guestsTeens || 0)
          + Number(formValues.guestsAdults || 0);
        store.dispatch('bookings/checkAvailability', {
          dateArrival: formValues.dateArrival,
          dateDeparture: formValues.dateDeparture,
          propertyId: formValues.propertyId,
          guests,
          bookingId: booking.value?.id,
        })
          .catch((error) => {
            if (error.code === 'BOOKINGS_MIN_STAY') {
              store.commit('bookings/SET_AVAILABILITY', undefined);
            }
            uikit.notify('danger', i18n.t(`core.errors.codes.${error.code}`));
          });
      }
    };

    watch(() => selectedRate.value, (rate) => {
      if (!rate) return;
      if (!rate.availability) return;
      const rates = rate.availability.nightlyRates;
      const avgPrice = Number(getAverageValue(Object.values(rates)).toFixed(2));
      const amountAccommodationDue = avgPrice * Object.values(rates).length;
      let amountDiscount;
      let { discountValue } = formValues;

      amountTotalTax.value = rate.availability.taxValue;

      if (booking.value) {
        amountDiscount = booking.value.amountDiscount;
        discountValue = getPercentByValue(amountDiscount, amountAccommodationDue);
      } else {
        amountDiscount = getDiscountAmount(amountAccommodationDue);
      }

      setValues({
        ...formValues,
        avgPrice,
        amountAccommodationDue,
        amountDiscount,
        discountValue,
      });
    });

    watch(() => booking.value, () => {
      if (booking.value) {
        amountTotalTax.value = booking.value.amountTotalTax;

        setValues({
          ...formValues,
          amountAccommodationDue: booking.value.amountAccommodationDue,
          avgPrice: getAvgPrice(
            booking.value.amountAccommodationDue,
            getNights(
              formatDateForInput(booking.value.dateDeparture),
              formatDateForInput(booking.value.dateArrival),
            ),
          ),
          discountValue: getPercentByValue(booking.value.amountDiscount, booking.value.amountAccommodationDue),
        });
      }
    });

    const onSubmit = handleSubmit((values, { setErrors }) => {
      const payload = {
        ...values,
        dateArrival: selectedRate.value
          ? setTimeForDate(
            dayjs(values.dateArrival).tz(timezone.value),
            getLocalTimeByUTC(selectedRate.value.checkinTime),
          )
            .toISOString()
          : undefined,
        dateDeparture: selectedRate.value
          ? setTimeForDate(
            dayjs(values.dateDeparture).tz(timezone.value),
            getLocalTimeByUTC(selectedRate.value.checkoutTime),
          )
            .toISOString()
          : undefined,
        amountSecureDeposited: getAccommodationDeposit(),
      };

      if (selectedRate.value?.availability?.taxEnabled) {
        payload.amountTotalTax = getTax();
      }

      store.commit('bookings/SET_FORM_LOADING', true);

      store.dispatch('bookings/upsert', payload)
        .then(({ data }) => Promise.all([data && store.dispatch('bookings/refreshEntity', data.id), emit('next', data)]))
        .then(() => store.dispatch('bookings/setList'))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', i18n.t(`core.errors.codes.${error.code}`));
          }
        })
        .finally(() => store.commit('bookings/SET_FORM_LOADING', false));
    });

    const getMinOptionDate = (date) => formatDateForInput(dayjs(date)
      .subtract(1, 'day'));

    const getMaxOptionDate = (date) => formatDateForInput(dayjs(date)
      .add(1, 'day'));

    const onClose = () => {
      uikit.drawer.hide();
    };

    const onDelete = () => uikit.modals.deleteConfirm(i18n.t('bookings.components.bookingInfo.deleteConfirm'))
      .then((dialog) => store.dispatch('bookings/delete', booking.value.id)
        .then(() => {
          onClose();
          emit('update');
        })
        .then(() => uikit.notify('success', i18n.t('bookings.components.bookingInfo.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      CALCULATION_TYPES,
      BOOKING_TYPES,
      values: formValues,
      errors: formErrors,
      bookingTypes,
      depositTypes,
      properties,
      unitTypes,
      units,
      channelCommissions,
      locale,
      currency,
      canBeEdited,
      booking,
      services,
      feesAndTaxes,
      amountTotalTax,
      loading,
      isHotel,
      selectedProperty,

      getLeftDays,
      validate,
      setValues,
      onSubmit,
      handleSubmitClick,
      formatCurrency,
      formatDateForInput,
      getChannelPercentage,
      onPropertyChange,
      onPropertyTypeChange,
      onChangeAvgPrice,
      onChangeTotalAmount,
      onChangeDiscountValue,
      onChangeAmountDiscount,
      getNights,
      getTotalPrice,
      getAccommodationCost,
      getAccommodationDeposit,
      getOutstandingAmount,
      getPercentByValue,
      checkAvailability,
      getMinOptionDate,
      getMaxOptionDate,
      onClose,
      onDelete,
    };
  },
};
</script>
