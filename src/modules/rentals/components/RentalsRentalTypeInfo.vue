<template>
  <div class="card">
    <div class="uk-flex uk-flex-top uk-flex-between uk-flex-wrap">
      <div class="card__header">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/house-info.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('rentals.components.rentalInfo.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('rentals.components.rentalInfo.description') }}</p>
      </div>
      <div v-if="areUnitFieldsVisible">
        <div class="switch-container">
          <core-form-switcher
            id="isActive"
            name="isActive"
            :checked="Boolean(unit?.isActive)"
          />
        </div>
      </div>
    </div>

    <div>
      <div class="grid">
        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors.name }" for="nameRentalType">
            {{ $t('rentals.views.overview.name') }}
          </label>
          <div class="input-container">
            <v-field
              id="nameRentalType"
              class="uk-input --outline"
              as="input"
              type="text"
              name="name"
              :label="$t('rentals.views.overview.name')"
              :class="{ '--invalid': errors.name }"
              rules="required|min:2"
              :value="rentalType?.name"
              v-e2e
            />
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>
      </div>
      <div class="uk-margin-bottom">
        <label class="input-label" :class="{ '--invalid': errors.description }" for="description">
          {{ $t('rentals.views.overview.description') }}
        </label>
        <div class="input-container">
          <v-field
            id="description"
            class="uk-textarea --outline description"
            as="textarea"
            name="description"
            :label="$t('rentals.views.overview.description')"
            :class="{ '--invalid': errors.description }"
            v-e2e
            :value="rentalType?.description"
          />
          <v-error-message class="input-error-message" name="description" />
        </div>
      </div>

      <div class="uk-flex uk-flex-middle uk-flex-wrap">
        <core-form-input-number
          class="uk-margin-right rental-size uk-margin-bottom"
          :label="$t('rentals.views.overview.rentalSize')"
          name="area"
          rules="required|between:1,5000"
          :value="rentalType?.area"
          :suffix="$t('core.dicts.units.' + (rentalType?.areaUnit || 'blank'))"
          float
        />

        <core-form-input-number
          class="uk-margin-right select-small uk-margin-bottom"
          :label="$t('rentals.views.overview.guest')"
          name="totalGuests"
          rules="required|between:1,20"
          :value="rentalType?.totalGuests"
        />

        <template v-if="areUnitFieldsVisible">
          <core-form-input-number
            class="uk-margin-right uk-margin-bottom"
            :label="$t('rentals.shared.floor')"
            name="floor"
            rules="between:0,100"
            :min="0"
            :max="100"
            :value="unit.floor"
          />
          <div class="uk-margin-right uk-margin-bottom">
            <label class="input-label" :class="{ '--invalid': errors.status }" for="status">
              {{ $t('rentals.shared.status') }}
            </label>
            <div class="input-container">
              <v-field
                id="status"
                as="select"
                name="status"
                class="uk-select --outline status-select"
                :value="unit.status"
                :class="[formValues.status, errors.status && '--invalid']"
              >
                <option v-for="status in STATUSES" :key="status" :value="status">
                  {{ $t('rentals.dicts.unitsStatuses.' + status) }}
                </option>
              </v-field>
              <v-error-message class="input-error-message uk-text-nowrap" name="status" />
            </div>
          </div>
        </template>
        <div class="guest-type uk-margin-bottom">
          <label class="input-label" :class="{ '--invalid': errors.dictGuestTypeId }" for="dictGuestTypeId">
            {{ $t('rentals.shared.guestType') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="dictGuestTypeId"
              name="dictGuestTypeId"
              :class="{ '--invalid': errors.dictGuestTypeId }"
              :label="$t('rentals.shared.guestType')"
              :value="rentalType?.dictGuestTypeId?.toString()"
              :data="guestTypes"
            />
            <v-error-message class="input-error-message" name="dictGuestTypeId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { hasAccess, LIMITS } from '@/utils/acl';
import { STATUSES } from '@/modules/rentals/services';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'RentalsRentalTypeInfo',
  props: {
    rentalType: {
      type: Object,
    },
    unit: {
      type: Object,
    },
    formValues: {
      type: Object,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    CoreFormSwitcher,
    CoreFormInputNumber,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();

    const areUnitFieldsVisible = computed(
      () => !hasAccess(store.state.core.limits, LIMITS.APP_PROPERTIES_UNITS_ENABLED),
    );

    const guestTypes = computed(() => store.state.core.guestTypes.map((guestType) => ({
      label: i18n.t(`core.dicts.guestTypes.${guestType.name}`),
      value: guestType.id.toString(),
    })));

    return {
      STATUSES,
      areUnitFieldsVisible,
      guestTypes,
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
.switch-container {
  height: 40px;
  display: flex;
}
.guest-type {
  width: 290px;
  margin-right: 20px;
}
</style>
