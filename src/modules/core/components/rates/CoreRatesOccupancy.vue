<template>
  <div class="card">
    <div class="rental__switch-wrapper">
      <div class="card__header uk-flex-1">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/occupancy.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('core.components.ratesOccupancy.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('core.components.ratesOccupancy.description') }}</p>
      </div>
      <core-form-switcher
        class="uk-margin-small-left"
        name="occupancyEnabled"
        :label="$t('core.shared.enabled')"
        :checked="!!rates.occupancyEnabled"
        @change="!$event && $emit('setErrors', {
          occupancyStartsAfterPerson: null,
          occupancyExtraCharge: null
        })"
      />
    </div>
    <div class="uk-position-relative">
      <div class="uk-flex uk-flex-middle uk-flex-wrap">
        <div class="uk-margin-bottom uk-margin-right uk-flex uk-flex-middle">
          <label
            class="input-label uk-margin-small-right --required"
            :class="{ '--invalid': errors.occupancyStartsAfterPerson }"
          >
            {{ $t('core.components.ratesOccupancy.occupancyStartsAfterPerson') }}
          </label>
          <core-form-input-number
            name="occupancyStartsAfterPerson"
            :placeholder="$t('core.components.ratesOccupancy.guests')"
            rules="required_if:occupancyEnabled,1|between_if:occupancyEnabled,1,1,1000"
            :value="rates.occupancyStartsAfterPerson"
          />
        </div>

        <div class="uk-margin-bottom uk-margin-right uk-flex uk-flex-middle">
          <label
            class="input-label uk-margin-small-right --required"
            :class="{ '--invalid': errors.occupancyExtraCharge }"
          >
            {{ $t('core.components.ratesOccupancy.occupancyExtraCharge') }}
          </label>
          <core-form-input-number
            name="occupancyExtraCharge"
            :placeholder="$t('core.components.ratesOccupancy.amountPlaceholder', {
              sign: formValues.currency
            })"
            :currency="formValues.currency"
            rules="required_if:occupancyEnabled,1|between_if:occupancyEnabled,1,0,10000"
            :value="rates.occupancyExtraCharge"
          />
        </div>
      </div>
      <div v-if="!formValues.occupancyEnabled" class="uk-position-cover uk-overlay-default"></div>
    </div>
  </div>
</template>

<script>
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import { DISCOUNT_TYPES } from '@/modules/core/services';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'CoreRatesOccupancy',
  components: {
    CoreFormInputNumber,
    CoreFormSwitcher,
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
