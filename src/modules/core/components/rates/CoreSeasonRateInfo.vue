<template>
  <div class="season-rate-info">
    <div class="card">
      <div class="rental__switch-wrapper">
        <div class="card__header uk-flex-1">
          <div class="card__heading uk-flex uk-flex-middle">
            <span
              class="uk-margin-small-right"
            >
              <core-svg
                :width="24"
                :src="require('@/assets/images/icons/calendar-check.svg')"
              />
            </span>
            <h5 class="card__title">{{ $t('core.components.seasonRateInfo.title') }}</h5>
          </div>
          <p class="card__description">{{ $t('core.components.seasonRateInfo.description') }}</p>
        </div>
      </div>
      <div class="grid">
        <div class="uk-margin-bottom name">
          <label
            class="input-label --required"
            :class="{ '--invalid': errors.name }"
            for="nameSeasonRate"
          >
            {{ $t('core.components.seasonRateInfo.seasonRates') }}
          </label>
          <div class="input-container">
            <v-field
              id="nameSeasonRate"
              class="uk-input --outline"
              name="name"
              type="text"
              :label="$t('core.components.seasonRateInfo.seasonName')"
              :class="{ '--invalid': errors.name }"
              rules="required"
              :value="rates.name"
              v-e2e
            />
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>

        <core-form-date-range
           class="uk-margin-bottom"
          :form-values="formValues"
          :errors="errors"
          :ranges="ranges"
          :startDateValue="rates.startDate"
          :endDateValue="rates.endDate"
        />

        <div class="uk-margin-bottom">
          <label
            class="input-label --required"
            :class="{ '--invalid': errors.cancellationPolicy }"
            for="cancellationPolicy"
          >
            {{ $t('core.components.seasonRateInfo.cancellationPolicy') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="cancellationPolicy"
              name="cancellationPolicy"
              :label="$t('core.components.seasonRateInfo.cancellationPolicy')"
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
import { onMounted } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import CoreFormDateRange from '@/modules/core/components/core-form/CoreFormDateRange.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import { CANCELLATION_POLICIES } from '@/modules/rentals/services/rates';

export default {
  name: 'CoreSeasonRateInfo',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormDateRange,
    CoreFormSelect,
  },
  props: {
    rates: {
      type: Object,
    },
    formValues: {
      type: Object,
    },
    errors: {
      type: Object,
    },
    currency: {
      type: String,
    },
    ranges: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['setBaseValues'],
  setup(props, { emit }) {
    const i18n = useI18n();

    const cancellationPolicies = Object.values(CANCELLATION_POLICIES).map((key) => ({
      label: i18n.t(`core.dicts.cancellationPolicies.${key}`),
      value: key,
    }));

    onMounted(() => {
      emit('setBaseValues', { currency: props.currency });
    });

    return {
      CANCELLATION_POLICIES,
      cancellationPolicies,
    };
  },
};
</script>
