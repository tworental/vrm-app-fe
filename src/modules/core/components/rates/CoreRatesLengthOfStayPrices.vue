<template>
  <div class="length-of-stay">
    <div class="card">
      <div class="rental__switch-wrapper">
        <div class="card__header uk-flex-1">
          <div class="card__heading uk-flex uk-flex-middle">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/house-buy.svg')"
              class="uk-margin-small-right"
            />
            <h5 class="card__title">{{ $t('core.components.lengthOfStayPrices.title') }}</h5>
          </div>
          <p class="card__description">{{ $t('core.components.lengthOfStayPrices.description.1') }}</p>
        </div>
        <core-form-switcher
          class="uk-margin-small-left"
          name="discountEnabled"
          :label="$t('core.shared.enabled')"
          :checked="!!rates.discountEnabled"
          @change="!$event && $emit('setErrors', {
            discountCustom: null,
            discountCustomPeriod: null,
          })"
        />
      </div>
      <div class="uk-position-relative">
        <div class="uk-flex uk-flex-bottom uk-flex-wrap">
          <core-form-input-number
            class="uk-margin-bottom uk-margin-right amount"
            name="discountWeekly"
            :label="$t('core.components.lengthOfStayPrices.weekly')"
            :placeholder="$t('core.components.lengthOfStayPrices.amountPlaceholder', {
                sign: isDiscountTypeAmount ? formValues.currency : '%'
            })"
            :rules="formValues.discountMonthly ? ('between_if:discountEnabled,1,' +
               (isDiscountTypeAmount ? '0,1000000000' : '0,100')) : ''"
            :value="rates.discountMonthly"
            :currency="isDiscountTypeAmount ? formValues.currency : undefined"
            :suffix="!isDiscountTypeAmount ? '%' : undefined"
            float
          />

          <core-form-input-number
            class="uk-margin-bottom uk-margin-right amount"
            name="discountMonthly"
            :label="$t('core.components.lengthOfStayPrices.monthly')"
            :placeholder="$t('core.components.lengthOfStayPrices.amountPlaceholder', {
                sign: isDiscountTypeAmount ? formValues.currency : '%'
            })"
            :rules="formValues.discountMonthly ? ('between_if:discountEnabled,1,' +
               (isDiscountTypeAmount ? '0,1000000000' : '0,100')) : ''"
            :value="rates.discountMonthly"
            :currency="isDiscountTypeAmount ? formValues.currency : undefined"
            :suffix="!isDiscountTypeAmount ? '%' : undefined"
            float
          />

          <div class="uk-flex uk-flex-middle uk-flex-wrap">
            <div class="uk-margin-right">
              <core-form-checkbox
                name="discountCustomEnabled"
                :label="$t('core.components.lengthOfStayPrices.customPeriod')"
                :checked="!!rates.discountCustomEnabled"
              />
            </div>
            <div class="uk-flex uk-flex-middle uk-flex-wrap">
              <core-form-input-number
                class="nights-input uk-margin-bottom uk-margin-small-right"
                :label="$t('core.components.lengthOfStayPrices.customPrice')"
                name="discountCustom"
                :placeholder="$t('core.components.lengthOfStayPrices.amountPlaceholder', {
                  sign: isDiscountTypeAmount ? formValues.currency : '%'
                })"
                :rules="'required_if:discountCustomEnabled,1|between:'
                 + (isDiscountTypeAmount ? '0,1000000000' : '0,100')"
                :value="rates.discountCustom"
                :disabled="!formValues.discountCustomEnabled"
                :currency="isDiscountTypeAmount ? formValues.currency : undefined"
                :suffix="!isDiscountTypeAmount ? '%' : undefined"
                float
              />
              <label class="input-label per-label uk-margin-small-right">
                {{ $t('core.components.lengthOfStayPrices.per') }}
              </label>
              <core-form-input-number
                class="uk-margin-bottom"
                :label="$t('core.components.lengthOfStayPrices.nights')"
                name="discountCustomPeriod"
                rules="required_if:discountCustomEnabled,1|between_if:discountCustomEnabled,1,1,1000"
                :placeholder="$t('core.components.lengthOfStayPrices.nightsPlaceholder')"
                :value="rates.discountCustomPeriod"
                :disabled="!formValues.discountCustomEnabled"
              />
            </div>
          </div>
        </div>
        <div v-if="!formValues.discountEnabled" class="uk-position-cover uk-overlay-default"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { DISCOUNT_TYPES } from '@/modules/core/services';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import CoreFormCheckbox from '../core-form/CoreFormCheckbox.vue';
import CoreFormSwitcher from '../core-form/CoreFormSwitcher.vue';

export default {
  name: 'CoreRatesLengthOfStayPrices',
  components: {
    CoreFormCheckbox,
    CoreFormSwitcher,
    CoreFormInputNumber,
  },
  props: {
    rates: {
      type: Object,
    },
    errors: {
      type: Object,
    },
    formValues: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['setValues', 'setBaseValues', 'setErrors'],
  setup(props, { emit }) {
    const i18n = useI18n();

    const types = Object.values(DISCOUNT_TYPES).map((discount) => ({
      label: i18n.t(`core.dicts.discountTypes.${discount}`),
      value: discount,
    }));

    const checkRules = (validations) => (props.formValues.discountEnabled ? validations : '');

    onMounted(() => {
      emit('setBaseValues', {
        discountType: props.rates.discountType || DISCOUNT_TYPES.AMOUNT,
        discountCustomEnabled: props.rates.discountCustomEnabled,
      });
    });

    const isDiscountTypeAmount = computed(() => props.formValues.discountType === DISCOUNT_TYPES.AMOUNT);

    return {
      DISCOUNT_TYPES,
      types,
      isDiscountTypeAmount,

      checkRules,
    };
  },
};
</script>
