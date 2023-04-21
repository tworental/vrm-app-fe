<template>
  <div class="card">
    <div class="rental__switch-wrapper">
      <div class="card__header uk-flex-1">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cash-pin.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('core.components.salesTax.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('core.components.salesTax.description') }}</p>
      </div>
      <core-form-switcher
        class="uk-margin-small-left"
        name="taxEnabled"
        :label="$t('core.shared.enabled')"
        :checked="!!rates.taxEnabled"
        @change="$emit('setErrors', {
          taxIncluded: null,
          taxPercentage: null
        })"
      />
    </div>
    <div class="uk-position-relative">
      <div class="uk-flex uk-flex-bottom uk-flex-wrap">
        <div class="type-select uk-margin-bottom uk-margin-right">
          <div class="input-container">
            <core-form-select
              id="taxType"
              name="taxIncluded"
              :label="$t('core.components.salesTax.taxType')"
              :class="{ '--invalid': errors.taxIncluded }"
              :value="rates.taxPercentage !== null ? rates.taxIncluded : 0"
              :data="taxesDropdown"
              :press-label="false"
              :show-placeholder="false"
              @update:modelValue="$event === '' && $emit('setValues', { taxIncluded: null })"
            />
            <v-error-message class="input-error-message" name="taxIncluded" />
          </div>
        </div>

        <core-form-input-number
          class="uk-margin-bottom"
          name="taxPercentage"
          :placeholder="$t('core.components.salesTax.taxPlaceholder')"
          rules="required_if:taxIncluded,1|between_if:taxEnabled,1,1,100"
          suffix="%"
          :value="rates.taxPercentage"
          :disabled="formValues.taxIncluded?.length === 0"
        />
      </div>
      <p class="card__description">{{ $t('core.components.salesTax.hint.1') }}</p>
      <p class="card__description">{{ $t('core.components.salesTax.hint.2') }}</p>

      <div v-if="!formValues.taxEnabled" class="uk-position-cover uk-overlay-default"></div>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'CoreRatesSalesTax',
  components: {
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
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
    const i18n = useI18n();

    const taxesDropdown = [
      { label: i18n.t('core.dicts.salesTaxTypes.include'), value: 1 },
      { label: i18n.t('core.dicts.salesTaxTypes.exclude'), value: 0 },
    ];

    return {
      taxesDropdown,
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
.type-select {
  width: 200px;
}
</style>
