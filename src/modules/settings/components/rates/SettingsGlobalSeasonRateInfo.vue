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
      <div class="grid uk-margin-bottom">
        <div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

export default {
  name: 'SettingsGlobalSeasonRateInfo',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
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
  },
  emits: ['setBaseValues'],
  setup(props, { emit }) {
    onMounted(() => {
      emit('setBaseValues', { currency: props.currency });
    });
  },
};
</script>
