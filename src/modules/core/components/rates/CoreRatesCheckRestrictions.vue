<template>
  <div class="check-restrictions">
    <div class="card">
      <div class="rental__switch-wrapper">
        <div class="card__header uk-flex-1">
          <div class="card__heading uk-flex uk-flex-middle">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/time-clock-hand.svg')"
              class="uk-margin-small-right"
            />
            <h5 class="card__title">{{ $t('core.components.checkRestrictions.title') }}</h5>
          </div>
          <p class="card__description">{{ $t('core.components.checkRestrictions.description') }}</p>
        </div>
        <core-form-switcher
          class="uk-margin-small-left"
          name="selfServiceRestrictionsEnabled"
          :label="$t('core.shared.enabled')"
          :checked="!!rates.selfServiceRestrictionsEnabled"
        />
      </div>

      <div class="uk-overflow-auto uk-position-relative">
        <table class="table uk-text-center">
          <thead>
          <tr>
            <th></th>
            <th
              v-for="day in WEEKDAYS"
              :key="day.name"
              class="weekday"
            >{{ $t('core.dicts.weekdays.' + day.name) }}</th>
            <th class="select-all">{{ $t('core.components.checkRestrictions.selectAll') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="check uk-text-left">{{ $t('core.components.checkRestrictions.checkIn') }}</td>
            <td
              v-for="day in WEEKDAYS"
              :key="day.name"
            >
              <core-form-checkbox
                class="uk-flex-center"
                :name="'selfServiceCheckin' + capitalizeFirstLetter(day.name)"
                :checked="!!(formValues['selfServiceCheckin' + capitalizeFirstLetter(day.name)])"
              />
            </td>
            <td>
              <core-form-checkbox
                class="uk-flex-center"
                name="selectAll"
                :checked="isAllChecked('selfServiceCheckin', formValues)"
                :indeterminate="isIndeterminate('selfServiceCheckin', formValues)"
                @change="onSelectAll('selfServiceCheckin', $event)"
              />
            </td>
          </tr>
          <tr>
            <td class="check uk-text-left">{{ $t('core.components.checkRestrictions.checkOut') }}</td>
            <td
              v-for="day in WEEKDAYS"
              :key="day.name"
            >
              <core-form-checkbox
                class="uk-flex-center"
                :name="'selfServiceCheckout' + capitalizeFirstLetter(day.name)"
                :checked="!!(formValues['selfServiceCheckout' + capitalizeFirstLetter(day.name)])"
              />
            </td>
            <td>
              <core-form-checkbox
                class="uk-flex-center"
                name="selectAll"
                :checked="isAllChecked('selfServiceCheckout', formValues)"
                :indeterminate="isIndeterminate('selfServiceCheckout', formValues)"
                @change="onSelectAll('selfServiceCheckout', $event)"
              />
            </td>
          </tr>
          </tbody>
        </table>
        <div v-if="!formValues.selfServiceRestrictionsEnabled" class="uk-position-cover uk-overlay-default"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';

import { WEEKDAYS } from '@/utils/datetime';
import { capitalizeFirstLetter } from '@/utils/text';

import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';

export default {
  name: 'CoreRatesCheckRestrictions',
  components: {
    CoreFormCheckbox,
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
      default: () => ({}),
    },
  },
  emits: ['setValues', 'setBaseValues'],
  setup(props, { emit }) {
    const onSelectAll = (key, value) => {
      const payload = WEEKDAYS.reduce((acc, curr) => ({
        ...acc,
        [`${key}${capitalizeFirstLetter(curr.name)}`]: Number(value),
      }), {});

      emit('setValues', payload);
    };

    const populateValues = (key, source) => WEEKDAYS.reduce((acc, curr) => {
      const fullKey = `${key}${capitalizeFirstLetter(curr.name)}`;

      return {
        ...acc,
        [fullKey]: Number(source[fullKey]),
      };
    }, {});

    const isIndeterminate = (key, values) => {
      const checkedValues = Object.values(populateValues(key, values))
        .filter(Boolean);

      return checkedValues.length > 0 && checkedValues.length < WEEKDAYS.length;
    };

    const isAllChecked = (key, values) => {
      const checkedValues = Object.values(populateValues(key, values))
        .filter(Boolean);

      return checkedValues.length === WEEKDAYS.length;
    };

    onMounted(() => {
      emit('setBaseValues', {
        ...populateValues('selfServiceCheckin', props.rates),
        ...populateValues('selfServiceCheckout', props.rates),
      });
    });

    return {
      WEEKDAYS,

      isIndeterminate,
      isAllChecked,
      onSelectAll,
      capitalizeFirstLetter,
    };
  },
};
</script>
