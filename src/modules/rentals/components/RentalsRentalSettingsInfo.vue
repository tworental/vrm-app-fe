<template>
  <div class="card">
    <div class="rental__switch-wrapper">
      <div class="card__header uk-flex-1">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/house-info.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('rentals.components.settingsInfo.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('rentals.components.settingsInfo.description') }}</p>
      </div>
    </div>
    <div>
      <div class="grid">
        <div>
          <label
            class="input-label"
            :class="{ '--invalid': errors.registrationNumber }"
            for="registrationNumber"
          >
            {{ $t('rentals.shared.registrationNumber') }}
          </label>
          <div class="input-container">
            <v-field
              id="registrationNumber"
              class="uk-input --outline"
              as="input"
              type="text"
              name="registrationNumber"
              :label="$t('rentals.shared.registrationNumber')"
              :class="{ '--invalid': errors.registrationNumber }"
              :value="rental.registrationNumber"
              rules="max:191"
              v-e2e
            />
            <v-error-message class="input-error-message" name="registrationNumber" />
          </div>
        </div>

        <div>
          <label
            class="input-label"
            :class="{ '--invalid': errors.internalCode }"
            for="internalCode"
          >
            {{ $t('rentals.shared.internalCode') }}
          </label>
          <div class="input-container">
            <v-field
              id="internalCode"
              class="uk-input --outline"
              as="input"
              type="text"
              name="internalCode"
              :label="$t('rentals.shared.internalCode')"
              :class="{ '--invalid': errors.internalCode }"
              :value="rental.internalCode"
              rules="max:191"
              v-e2e
            />
            <v-error-message class="input-error-message" name="internalCode" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

export default {
  name: 'RentalsRentalSettingsInfo',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  props: {
    errors: {
      type: Object,
    },
  },
  setup() {
    const store = useStore();

    const rental = computed(() => store.state.rentals.rentals.entity);

    return {
      rental,
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
.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;

  @include fromWideMobile {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  }

  @include fromTablet {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}
</style>
