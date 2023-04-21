<template>
  <div class="card">
    <div class="card__header">
      <div class="card__heading uk-flex uk-flex-middle">
        <core-svg
          :width="24"
          :src="require('@/assets/images/icons/distance.svg')"
          class="uk-margin-small-right"
        />
        <h5 class="card__title">{{ $t('rentals.components.locationDistances.distances.title') }}</h5>
      </div>
      <p class="card__description">{{ $t('rentals.components.locationDistances.distances.description.1') }}</p>
      <p class="card__description">{{ $t('rentals.components.locationDistances.distances.description.2') }}</p>
    </div>

    <div>
      <div class="directions">
        <div class="direction-item uk-margin-bottom" v-for="distanceType in distanceTypes" :key="distanceType">
          <div>
            <core-svg width="20" :src="require('@/assets/images/icons/rentals/distances/' + distanceType + '.svg')" />
            <label class="uk-margin-small-left">
              {{ $t('rentals.dicts.distanceTypes.' + distanceType) }}
            </label>
          </div>
          <core-form-input-number
            class="direction-input"
            :name="'distances.' + distanceType"
            rules="between:0,500"
            :placeholder="defaultDistanceUnit && $t('core.dicts.units.' + defaultDistanceUnit)"
            :value="rental.distances ? (rental.distances[distanceType] || null) : null"
            :suffix="$t('core.dicts.units.' + defaultDistanceUnit)"
            float
          />
        </div>
      </div>
    </div>

    <div class="card__header">
      <div class="card__heading uk-flex uk-flex-middle">
        <core-svg
          :width="24"
          :src="require('@/assets/images/icons/compass-arrow.svg')"
          class="uk-margin-small-right"
        />
        <h5 class="card__title">{{ $t('rentals.components.locationDistances.directions.title') }}</h5>
      </div>
      <p class="card__description">{{ $t('rentals.components.locationDistances.directions.description') }}</p>
    </div>

    <div>
      <v-field
        id="textarea"
        class="uk-textarea --outline description"
        as="textarea"
        name="directions"
        :placeholder="$t('rentals.components.locationDistances.directions.description')"
        :value="rental.directions"
        v-e2e
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { Field } from 'vee-validate';

import { DISTANCE_UNITS } from '@/modules/rentals/services';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'RentalsLocationDistances',
  components: {
    CoreFormInputNumber,
    VField: Field,
  },
  props: {
    formValues: {
      type: Object,
    },
    errors: {
      type: Object,
    },
  },
  setup() {
    const store = useStore();

    const defaultDistanceUnit = computed(
      () => DISTANCE_UNITS[store.state.account.account.settings.measuringUnits],
    );
    const rental = computed(() => store.state.rentals.rentals.entity);
    const distanceTypes = computed(() => store.state.rentals.dicts.distanceTypes);

    return {
      rental,
      distanceTypes,
      defaultDistanceUnit,
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
    margin-bottom: 12px;
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
.description {
  min-height: 100px;
}
.direction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 280px;
  margin-right: 30px;
  white-space: nowrap;

  .direction-input {
    width: 95px;
  }
}
.directions {
  display: grid;
  padding-bottom: 20px;
  grid-template-columns: 1fr;

  @include fromTablet {
    grid-template-columns: 1fr 1fr;
  }

  @include mediaFrom(1360px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
