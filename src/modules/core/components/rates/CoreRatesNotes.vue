<template>
  <div class="card">
    <div class="rental__switch-wrapper">
      <div class="card__header uk-flex-1">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/house-buy.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('core.components.ratesNotes.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('core.components.ratesNotes.description') }}</p>
      </div>
      <core-form-switcher
        class="uk-margin-small-left"
        name="notesEnabled"
        :label="$t('core.shared.enabled')"
        :checked="!!rates.notesEnabled"
      />
    </div>
    <div class="uk-position-relative">
      <div class="uk-margin-bottom">
        <label class="input-label" :class="{ '--invalid': errors.notes }" for="notes">
          {{ $t('core.components.ratesNotes.notes') }}
        </label>
        <div class="input-container">
          <v-field
            id="notes"
            class="uk-textarea --outline notes"
            as="textarea"
            name="notes"
            :label="$t('core.components.ratesNotes.notes')"
            :class="{ '--invalid': errors.notes }"
            :value="rates.notes"
            v-e2e
          />
          <v-error-message class="input-error-message" name="notes" />
        </div>
      </div>
      <div v-if="!formValues.notesEnabled" class="uk-position-cover uk-overlay-default"></div>
    </div>
  </div>
</template>

<script>
import { ErrorMessage, Field } from 'vee-validate';

import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';

export default {
  name: 'CoreRatesNotes',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
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
.notes {
  min-height: 100px;
}
</style>
