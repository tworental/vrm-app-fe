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
    </div>

    <div>
      <div class="grid uk-margin-bottom">
        <div>
          <label class="input-label --required" :class="{ '--invalid': errors.name }" for="nameRental">
            {{ $t('rentals.views.overview.name') }}
          </label>
          <div class="input-container">
            <v-field
              id="nameRental"
              class="uk-input --outline"
              as="input"
              type="text"
              name="name"
              :label="$t('rentals.views.overview.name')"
              :class="{ '--invalid': errors.name }"
              rules="required|min:2"
              :value="rental?.name"
              v-e2e
            >
            </v-field>
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>

        <div>
          <label class="input-label --required" :class="{ '--invalid': errors.dictPropertyTypeId }" for="propertyType">
            {{ $t('rentals.views.overview.propertyType') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="propertyType"
              :data="propertyTypes"
              name="dictPropertyTypeId"
              rules="required"
              :label="$t('rentals.views.overview.propertyType')"
              :class="{ '--invalid': errors.dictPropertyTypeId }"
              :value="rental?.dictPropertyTypeId"
            />
            <v-error-message class="input-error-message" name="dictPropertyTypeId" />
          </div>
        </div>

        <div class="uk-flex uk-flex-middle" v-if="!rental?.multipleUnitTypes">
          <core-form-input-number
            class="uk-margin-right uk-width-1-1"
            :label="$t('rentals.views.overview.rentalSize')"
            name="area"
            rules="required|between:1,5000"
            :value="rentalType?.area"
            :suffix="$t('core.dicts.units.' + (rentalType?.areaUnit || 'blank'))"
            float
          />
          <core-form-input-number
            class="uk-width-1-1"
            :label="$t('rentals.views.overview.guest')"
            name="totalGuests"
            rules="required|between:1,20"
            :value="rentalType?.totalGuests"
          />
        </div>
      </div>
      <div class="uk-margin-bottom">
        <label class="input-label --required" :class="{ '--invalid': errors.description }" for="description">
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
            rules="required"
            :value="rental?.description"
          />
          <v-error-message class="input-error-message" name="description" />
        </div>
      </div>

      <div>
        <div class="uk-flex uk-flex-middle uk-flex-wrap">
          <div class="uk-margin-right select-medium">
            <label class="input-label --required" :class="{ '--invalid': errors.checkinTime }" for="checkIn">
              {{ $t('rentals.views.overview.checkIn') }}
            </label>
            <div class="input-container">
              <core-form-select
                id="checkIn"
                name="checkinTime"
                :label="$t('rentals.views.overview.checkIn')"
                :class="{ '--invalid': errors.checkinTime }"
                rules="required"
                :value="getCheckin()"
                :data="times"
                :press-label="false"
              />
              <v-error-message class="input-error-message" name="checkinTime" />
            </div>
          </div>
          <div class="uk-margin-right select-medium">
            <label class="input-label --required" :class="{ '--invalid': errors.checkoutTime }" for="checkOut">
              {{ $t('rentals.views.overview.checkOut') }}
            </label>
            <div class="input-container">
              <core-form-select
                id="checkOut"
                name="checkoutTime"
                :label="$t('rentals.views.overview.checkOut')"
                :class="{ '--invalid': errors.checkoutTime }"
                rules="required"
                :value="getCheckout()"
                :data="times"
                :press-label="false"
              />
              <v-error-message class="input-error-message" name="checkoutTime" />
            </div>
          </div>

          <core-form-input-number
            class="uk-margin-right select-medium"
            v-if="!rental?.multipleUnitTypes"
            :label="$t('rentals.shared.floor')"
            name="floor"
            rules="between:0,100"
            :value="unit.floor"
          />

          <div class="uk-margin-right" v-if="!rental?.multipleUnitTypes">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorMessage, Field } from 'vee-validate';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { getTimes } from '@/utils/datetime';
import { STATUSES } from '@/modules/rentals/services';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import { getLocalTimeByUTC } from '@/utils/intl';

export default {
  name: 'RentalsRentalInfo',
  props: {
    rental: {
      type: Object,
    },
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
    CoreFormInputNumber,
  },
  setup(props) {
    const i18n = useI18n();
    const store = useStore();

    const times = computed(() => getTimes(store.state.account.account.settings.timeFormat));
    const timezone = computed(() => store.getters['core/timezone']);
    const propertyTypes = computed(() => store.state.rentals.dicts.propertyTypes.map((propertyType) => ({
      value: propertyType.id,
      label: i18n.t(`rentals.dicts.propertyTypes.${propertyType.name}`),
    })));

    const getCheckin = () => getLocalTimeByUTC(props.rental.checkinTime, timezone.value);
    const getCheckout = () => getLocalTimeByUTC(props.rental.checkoutTime, timezone.value);

    return {
      STATUSES,
      times,
      propertyTypes,

      getCheckin,
      getCheckout,
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
.select-medium {
  min-width: 100px;
}
.switch-container {
  height: 40px;
  display: flex;
}
</style>
