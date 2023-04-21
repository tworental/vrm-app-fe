<template>
  <div class="min-stay">
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
            <h5 class="card__title">{{ $t('core.components.minimumStayPerWeekday.title') }}</h5>
          </div>
          <p class="card__description">{{ $t('core.components.minimumStayPerWeekday.description') }}</p>
        </div>
        <core-form-switcher
          class="uk-margin-small-left"
          name="minStayWeekdayEnabled"
          :label="$t('core.shared.enabled')"
          :checked="!!rates.minStayWeekdayEnabled"
          @change="!$event && validateAllFields()"
        />
      </div>
      <div class="uk-overflow-auto uk-position-relative">
        <table class="rental-table">
          <thead>
          <th class="rental-table__th uk-text-left room-type-col" v-if="rentalType">
            {{ $t('core.components.minimumStayPerWeekday.roomType') }}
          </th>
          <th
            class="rental-table__th"
            :class="{ '--settings': !rentalType }"
          >
            {{ $t('core.components.minimumStayPerWeekday.minStay') }}
          </th>
          <th
            class="rental-table__th weekday uk-position-relative"
            v-for="day in WEEKDAYS"
            :key="day.name"
            :class="{'--filled': day.holiday}"
          >
            {{ $t('core.dicts.weekdays.' + day.name) }}
            <div
              v-if="!formValues.minStayWeekdayEnabled"
              class="uk-overlay uk-overlay-default uk-position-cover uk-padding-remove"
            ></div>
          </th>
          </thead>
          <tbody>
          <tr>
            <td class="rental-table__td" v-if="rentalType">
              <div class="uk-text-bold uk-text-small">
                {{ rentalType.name }}
              </div>
            </td>
            <td class="rental-table__td uk-padding-remove">
              <core-form-input-number
                class="rental-table__input uk-text-center"
                name="minStayDays"
                :placeholder="$t('core.components.minimumStayPerWeekday.placeholder')"
                :rules="'between_if:minStayWeekdayEnabled,1,1,1000'"
                :value="rates.minStayDays"
                @input="formValues.minStayWeekdayEnabled && setDefaultMinStayDays($event)"
              />
            </td>
            <td
              class="rental-table__td uk-padding-remove"
              v-for="day in WEEKDAYS"
              :key="day.name"
              :class="{ '--filled': day.holiday, 'uk-position-relative': !formValues.minStayWeekdayEnabled }"
            >
              <core-form-input-number
                class="rental-table__input uk-text-center"
                :name="'minStayWeekday' + capitalizeFirstLetter(day.name)"
                :placeholder="$t('core.components.minimumStayPerWeekday.placeholder')"
                :rules="'between_if:minStayWeekdayEnabled,1,1,1000'"
                :value="rates['minStayWeekday' + capitalizeFirstLetter(day.name)]"
                :disabled="!formValues.minStayWeekdayEnabled"
              />
            </td>
          </tr>
          </tbody>
        </table>
        <div
          v-if="!formValues.minStayWeekdayEnabled"
          class="uk-overlay uk-overlay-default uk-position-cover uk-padding-remove"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { WEEKDAYS } from '@/utils/datetime';
import { capitalizeFirstLetter } from '@/utils/text';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'CoreRatesMinimumStayPerWeekday',
  components: {
    CoreFormSwitcher,
    CoreFormInputNumber,
  },
  props: {
    rates: {
      type: Object,
    },
    rentalType: {
      type: Object,
      default: () => null,
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
  emits: ['setValues', 'validateField'],
  setup(props, { emit }) {
    const validateAllFields = () => {
      const fields = [
        'minStayDays',
        'minStayWeekdayMo',
        'minStayWeekdayTu',
        'minStayWeekdayWe',
        'minStayWeekdayTh',
        'minStayWeekdayFr',
        'minStayWeekdaySa',
        'minStayWeekdaySu',
      ];

      fields.forEach((field) => emit('validateField', field));
    };

    const setDefaultMinStayDays = (minStayDays) => {
      const payload = {
        minStayDays,
        minStayWeekdayMo: minStayDays,
        minStayWeekdayTu: minStayDays,
        minStayWeekdayWe: minStayDays,
        minStayWeekdayTh: minStayDays,
        minStayWeekdayFr: minStayDays,
        minStayWeekdaySa: minStayDays,
        minStayWeekdaySu: minStayDays,
      };
      emit('setValues', payload);

      validateAllFields();
    };

    const checkRules = (validations) => (props.formValues.minStayWeekdayEnabled ? validations : '');

    return {
      WEEKDAYS,

      setDefaultMinStayDays,
      capitalizeFirstLetter,
      checkRules,
      validateAllFields,
    };
  },
};
</script>
