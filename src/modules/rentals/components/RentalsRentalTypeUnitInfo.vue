<template>
  <div class="card">
    <div class="card__header">
      <div class="card__heading uk-flex uk-flex-middle">
        <core-svg
          :width="24"
          :src="require('@/assets/images/icons/house-info.svg')"
          class="uk-margin-small-right"
        />
        <h5 class="card__title">{{ $t('rentals.components.unitInfo.title') }}</h5>
      </div>
      <p class="card__description">{{ $t('rentals.components.unitInfo.description') }}</p>
    </div>

    <div>
      <div class="grid">
        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors.name }" for="nameUnit">
            {{ $t('rentals.views.overview.name') }}
          </label>
          <div class="input-container">
            <v-field
              id="nameUnit"
              class="uk-input --outline"
              as="input"
              type="text"
              name="name"
              :label="$t('rentals.views.overview.name')"
              :class="{ '--invalid': errors.name }"
              rules="required|min:2"
              :value="unit.name"
              v-e2e
            />
            <div class="uk-position-center-right uk-margin-small-right">
              <v-field
                class="color-input"
                as="input"
                name="color"
                type="color"
                :label="$t('rentals.shared.nameLabel')"
                :placeholder="$t('rentals.shared.namePlaceholder')"
                :class="{ '--invalid': errors.color }"
                :value="unit.color || '#ffffff'"
                v-e2e
              />
            </div>
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>
      </div>
      <div class="uk-flex uk-flex-middle uk-margin-bottom">
        <core-form-input-number
          class="rental-size uk-margin-right"
          :label="$t('rentals.views.overview.rentalSize')"
          name="area"
          rules="required|between:1,5000"
          :min="1"
          :max="5000"
          :value="unit.area"
          float
          :suffix="$t('core.dicts.units.' + (unit?.areaUnit || 'blank'))"
        />
        <core-form-input-number
          class="select-small"
          :label="$t('rentals.shared.floor')"
          name="floor"
          rules="between:0,100"
          :min="0"
          :max="100"
          :value="unit.floor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorMessage, Field } from 'vee-validate';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'RentalsRentalTypeUnitInfo',
  props: {
    unit: {
      type: Object,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CoreFormInputNumber,
    VField: Field,
    VErrorMessage: ErrorMessage,
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
    grid-template-columns: 1fr 1fr;
  }

  @include mediaFrom(1250px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
.description {
  min-height: 100px;
}
.size-label {
  padding-right: 5px;
  white-space: nowrap;
  font-size: 0.875rem;
  color: $input-suffix-color;
}
.select-small {
  min-width: 100px;

  @include fromWideMobile {
    min-width: 120px;
  }
}
.select-medium {
  min-width: 100px;
  @include fromWideMobile {
    min-width: 160px;
  }
}
.rental-size {
  min-width: 150px;
}
.color-input {
  height: 20px;
  width: 20px;
  border: none;
}
</style>
