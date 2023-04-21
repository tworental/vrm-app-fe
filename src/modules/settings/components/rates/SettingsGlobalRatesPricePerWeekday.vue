<template>
  <div class="card">
    <div class="rental__switch-wrapper">
      <div class="card__header uk-flex-1">
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/calendar-cash.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('rentals.components.pricePerWeekday.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('rentals.components.pricePerWeekday.description.1') }}</p>
        <p class="card__description">{{ $t('rentals.components.pricePerWeekday.description.2') }}</p>
      </div>
      <core-form-switcher
        class="uk-margin-small-left"
        name="priceWeekdayEnabled"
        :label="$t('rentals.shared.enabled')"
        :checked="!!rates.priceWeekdayEnabled"
        @change="!$event && validateAllFields()"
      />
    </div>
    <div class="uk-overflow-auto uk-position-relative">
      <table class="rental-table">
        <thead>
          <th class="rental-table__th default-price">
            {{ $t('rentals.components.pricePerWeekday.defaultPriceForAllDays') }}
          </th>
          <th
            class="rental-table__th weekday"
            v-for="day in WEEKDAYS"
            :key="day.name"
            :class="{'--filled': day.holiday}"
          >{{ $t('core.dicts.weekdays.' + day.name) }}</th>
        </thead>
        <tbody>
          <tr>
            <td class="rental-table__td uk-position-relative uk-padding-remove">
              <core-form-input-number
                class="rental-table__input uk-text-right"
                name="priceNightly"
                rules="required_if:priceWeekdayEnabled,1|between_if:priceWeekdayEnabled,1,0,1000000000"
                :placeholder="$t('rentals.components.pricePerWeekday.amountPlaceholder', {
                  sign: formValues.currency
                })"
                :currency="formValues.currency"
                :value="rates.priceNightly"
                @input="setDefaultPrice($event)"
                float
              />
            </td>
            <td
              class="rental-table__td uk-position-relative uk-padding-remove weekday"
              v-for="day in WEEKDAYS"
              :key="day.name"
              :class="{ '--filled': day.holiday }"
            >
              <core-form-input-number
                class="rental-table__input uk-text-right"
                :name="'priceWeekday' + capitalizeFirstLetter(day.name)"
                rules="required_if:priceWeekdayEnabled,1|between_if:priceWeekdayEnabled,1,0,1000000000"
                :placeholder="$t('rentals.components.pricePerWeekday.amountPlaceholder', {
                  sign: formValues.currency
                })"
                :currency="formValues.currency"
                :value="rates['priceWeekday' + capitalizeFirstLetter(day.name)]"
                float
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!formValues.priceWeekdayEnabled" class="uk-position-cover uk-overlay-default"></div>
    </div>
  </div>
</template>

<script>
import { WEEKDAYS } from '@/utils/datetime';
import { capitalizeFirstLetter } from '@/utils/text';

import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'SettingsGlobalRatesPricePerWeekday',
  components: {
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
    submitCount: {
      type: Number,
    },
  },
  emits: ['setValues', 'setErrors', 'validateField'],
  setup(props, { emit }) {
    const validateAllFields = () => {
      const fields = [
        'priceNightly',
        'priceWeekdayMo',
        'priceWeekdayTu',
        'priceWeekdayWe',
        'priceWeekdayTh',
        'priceWeekdayFr',
        'priceWeekdaySa',
        'priceWeekdaySu',
      ];

      fields.forEach((field) => emit('validateField', field));
    };

    const setDefaultPrice = (priceNightly) => {
      if (!Number.isFinite(Number(priceNightly))) { return; }

      const payload = {
        priceNightly,
        priceWeekdayMo: priceNightly,
        priceWeekdayTu: priceNightly,
        priceWeekdayWe: priceNightly,
        priceWeekdayTh: priceNightly,
        priceWeekdayFr: priceNightly,
        priceWeekdaySa: priceNightly,
        priceWeekdaySu: priceNightly,
      };
      emit('setValues', payload);

      validateAllFields();
    };

    const checkRules = (validations) => (props.formValues.priceWeekdayEnabled ? validations : '');

    return {
      WEEKDAYS,

      setDefaultPrice,
      capitalizeFirstLetter,
      checkRules,
      validateAllFields,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;

  .rental__switch-wrapper {
    padding: 20px;
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

.weekday {
  width: 77px;

  @include fromTablet {
    width: 140px;
  }
}
.rental-table__input {
  min-width: 90px;

  &.--has-value {
    padding-right: 32px;
  }
}
.default-price {
  padding-right: 0;
  padding-left: 0;
  min-width: 150px;
}
</style>
