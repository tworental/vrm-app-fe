<template>
  <div class="rates-details">
    <div class="card">
      <div class="rental__switch-wrapper">
        <div class="card__header uk-flex-1">
          <div class="card__heading uk-flex uk-flex-middle">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/currency-euro.svg')"
              class="uk-margin-small-right"
            />
            <h5 class="card__title">{{ $t('core.components.ratesDetails.title') }}</h5>
          </div>
          <p class="card__description">{{ $t('core.components.ratesDetails.description') }}</p>
        </div>
      </div>
      <div class="uk-flex uk-flex-wrap">
        <div class="currency-select uk-margin-bottom uk-margin-right">
          <label class="input-label --required" :class="{ '--invalid': errors.currency }" for="currency">
            {{ $t('core.components.ratesDetails.currency') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="currency"
              name="currency"
              :label="$t('core.components.ratesDetails.currency')"
              :class="{ '--invalid': errors.currency }"
              rules="required"
              :value="rates.currency"
              :data="currencies"
              :press-label="false"
              :search="true"
              :show-placeholder="false"
            />
            <v-error-message class="input-error-message" name="currency" />
          </div>
        </div>

        <div class="uk-margin-bottom uk-margin-right">
          <label
            class="input-label --required"
            :class="{ '--invalid': errors.cancellationPolicy }"
            for="cancellationPolicy"
          >
            {{ $t('core.components.ratesDetails.cancellationPolicy') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="cancellationPolicy"
              name="cancellationPolicy"
              :label="$t('core.components.ratesDetails.cancellationPolicy')"
              :class="{ '--invalid': errors.cancellationPolicy }"
              rules="required"
              :value="rates.cancellationPolicy || CANCELLATION_POLICIES.FREE_CANCELLATION_POLICY"
              :data="cancellationPolicies"
              :press-label="false"
              :show-placeholder="false"
            />
            <v-error-message class="input-error-message" name="cancellationPolicy" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import { CANCELLATION_POLICIES } from '@/modules/rentals/services/rates';

export default {
  name: 'CoreRatesDetails',
  components: {
    CoreFormSelect,
    VErrorMessage: ErrorMessage,
  },
  props: {
    rates: {
      type: Object,
    },
    errors: {
      type: Object,
    },
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();

    const currencies = computed(() => store.getters['core/currencies']);
    const cancellationPolicies = Object.values(CANCELLATION_POLICIES).map((key) => ({
      label: i18n.t(`core.dicts.cancellationPolicies.${key}`),
      value: key,
    }));

    return {
      CANCELLATION_POLICIES,

      currencies,
      cancellationPolicies,
    };
  },
};
</script>
