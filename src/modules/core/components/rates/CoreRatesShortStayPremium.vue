<template>
  <div class="card">
    <div class="rental__switch-wrapper">
      <div class="card__header uk-flex-1">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/time-clock.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('core.components.shortStayPremium.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('core.components.shortStayPremium.description') }}</p>
      </div>
      <core-form-switcher
        class="uk-margin-small-left"
        name="shortStayEnabled"
        :label="$t('core.shared.enabled')"
        :checked="!!rates.shortStayEnabled"
        @change="!$event && $emit('setErrors', {
          shortStayDays: null,
          shortStayExtraCharge: null
        })"
      />
    </div>
    <div class="uk-position-relative">
      <div class="uk-flex uk-flex-middle uk-flex-wrap">
        <core-form-input-number
          class="uk-margin-bottom uk-margin-right uk-flex uk-flex-middle"
          :label="$t('core.components.shortStayPremium.stayNoMoreThan')"
          name="shortStayDays"
          :placeholder="$t('core.components.shortStayPremium.nightsField')"
          rules="required_if:shortStayEnabled,1|between_if:shortStayEnabled,1,1,365"
          :value="rates.shortStayDays"
        />

        <core-form-input-number
          class="uk-margin-bottom uk-margin-right uk-flex uk-flex-middle"
          :label="$t('core.components.shortStayPremium.extraCharge')"
          name="shortStayExtraCharge"
          :placeholder="$t('core.components.shortStayPremium.amountPlaceholder', {
            sign: formValues.currency
          })"
          rules="required_if:shortStayEnabled,1|between_if:shortStayEnabled,1,0,10000"
          :value="rates.shortStayExtraCharge"
          :currency="formValues.currency"
        />
      </div>
      <div v-if="!formValues.shortStayEnabled" class="uk-position-cover uk-overlay-default"></div>
    </div>
  </div>
</template>

<script>
import { DISCOUNT_TYPES } from '@/modules/core/services';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'CoreRatesShortStayPremium',
  components: {
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
    },
  },
  emits: ['setValues', 'setErrors'],
  setup() {
    return {
      DISCOUNT_TYPES,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;
  padding: 20px;

  &__header {
    margin-bottom: 24px;
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
</style>
