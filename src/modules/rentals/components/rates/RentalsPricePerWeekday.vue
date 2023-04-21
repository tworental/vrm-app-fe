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
    </div>
    <div class="uk-position-relative">
      <div class="uk-overflow-auto">
        <table class="rental-table">
          <thead>
          <th
            class="rental-table__th uk-text-left room-type-col"
          >
            {{ $t('rentals.components.pricePerWeekday.roomType') }}
          </th>
          <th class="rental-table__th">{{ $t('rentals.components.pricePerWeekday.accommodation') }}</th>
          <th class="rental-table__th">{{ $t('rentals.components.pricePerWeekday.defaultPriceForAllDays') }}</th>
          <th
            class="rental-table__th weekday"
            v-for="day in WEEKDAYS"
            :key="day.name"
            :class="{'--filled': day.holiday}"
          >{{ $t('core.dicts.weekdays.' + day.name) }}</th>
          </thead>
          <tbody v-if="formValues.pricesNightly">
          <tr v-for="(priceNightly, idx) in rates.pricesNightly" :key="priceNightly.id">
            <td class="rental-table__td" v-if="idx === 0" :rowspan="rates.pricesNightly.length">
              <div class="uk-text-bold uk-text-small">{{ rentalType.name }}</div>
            </td>
            <td
              class="rental-table__td"
              :class="{ '--disabled': !formValues.pricesNightly[idx].enabled }"
            >
              <v-field
                :name="'pricesNightly[' + idx + '].id'"
                type="hidden"
                :value="rates.pricesNightly[idx].id"
                v-e2e
              />
              <div class="uk-text-small">
                <core-form-checkbox
                  :name="'pricesNightly[' + idx + '].enabled'"
                  :label="$t('rentals.components.pricePerWeekday.person', { num: idx + 1 })"
                  :checked="!!(formValues.pricesNightly[idx].enabled)"
                />
              </div>
            </td>
            <td
              class="rental-table__td uk-position-relative uk-padding-remove"
              :class="{ '--disabled': !formValues.pricesNightly[idx].enabled }"
            >
              <core-form-input-number
                class="rental-table__input uk-text-right"
                :name="'pricesNightly[' + idx + '].priceNightly'"
                :rules="!!formValues.pricesNightly[idx].enabled ? 'required|between:0,1000000000' : ''"
                :class="{
                  '--hidden': !(formValues.pricesNightly[idx].enabled),
                }"
                :placeholder="$t('rentals.components.pricePerWeekday.amountPlaceholder', {
                  sign: formValues.currency
                })"
                :value="formValues.pricesNightly[idx].priceNightly"
                :disabled="!formValues.pricesNightly[idx].enabled"
                :currency="formValues.currency"
                :validate-on-value-update="false"
                float
                @input="setDefaultPrice($event, idx)"
              />
            </td>
            <td
              class="rental-table__td uk-position-relative uk-padding-remove"
              v-for="day in WEEKDAYS"
              :key="day.name"
              :class="{
                '--filled': day.holiday,
                '--disabled': !formValues.pricesNightly[idx].enabled,
              }"
            >
              <core-form-input-number
                class="rental-table__input uk-text-right"
                :name="'pricesNightly[' + idx + '].priceWeekday' + capitalizeFirstLetter(day.name)"
                :value="formValues.pricesNightly[idx]['priceWeekday' + capitalizeFirstLetter(day.name)]"
                :class="{
                  '--hidden': !(formValues.pricesNightly[idx].enabled),
                }"
                :rules="!!formValues.pricesNightly[idx].enabled ? 'required|between:0,1000000000' : ''"
                :placeholder="$t('rentals.components.pricePerWeekday.amountPlaceholder', {
                  sign: formValues.currency
                })"
                :currency="formValues.currency"
                :disabled="!formValues.pricesNightly[idx].enabled"
                :validate-on-value-update="false"
                float
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { Field } from 'vee-validate';

import { WEEKDAYS } from '@/utils/datetime';
import { capitalizeFirstLetter } from '@/utils/text';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'RentalsPricePerWeekday',
  components: {
    CoreFormInputNumber,
    VField: Field,
    CoreFormCheckbox,
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
  emits: ['setValues', 'setBaseValues', 'validateField'],
  setup(props, { emit }) {
    const store = useStore();

    const rentalType = computed(() => store.state.rentals.rentalTypes.entity);

    const setDefaultPrice = (priceNightly, row) => {
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
      emit('setValues', {
        pricesNightly: props.formValues.pricesNightly.map((priceRow, idx) => ({
          ...priceRow,
          ...(row === idx ? payload : {}),
        })),
      });

      const fields = [
        `pricesNightly[${row}].priceWeekdayMo`,
        `pricesNightly[${row}].priceWeekdayTu`,
        `pricesNightly[${row}].priceWeekdayWe`,
        `pricesNightly[${row}].priceWeekdayTh`,
        `pricesNightly[${row}].priceWeekdayFr`,
        `pricesNightly[${row}].priceWeekdaySa`,
        `pricesNightly[${row}].priceWeekdaySu`,
      ];

      fields.forEach((field) => emit('validateField', field));
    };

    onMounted(() => {
      emit('setBaseValues', {
        pricesNightly: props.rates.pricesNightly,
      });
    });

    return {
      WEEKDAYS,
      rentalType,

      setDefaultPrice,
      capitalizeFirstLetter,
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
}
.rental-table__input {
  min-width: 90px;

  &.--has-value {
    padding-right: 32px;
  }
  &.--hidden {
    opacity: 0;
    pointer-events: none;
  }
}
.room-type-col {
  min-width: 200px;
  box-sizing: border-box;
}
</style>
