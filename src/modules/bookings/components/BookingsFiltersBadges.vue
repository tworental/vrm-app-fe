<template>
  <div class="bookings-badges">
    <span class="uk-badge badge--light">
      <span
        class="bookings-badges__dates-prev"
        @click="onPrevDate"
        :uk-tooltip="'title: ' + $t('bookings.components.filtersBadges.prevMonth')"
      >
        <core-svg :width="10" :src="require('@/assets/images/icons/arrow-left-range.svg')" />
      </span>
      <span class="bookings-badges__dates more" @click="$emit('click')">
        {{ formatDate(filters.startDate, locale, timezone, dateFormat, false) }}
        -
        {{ formatDate(filters.endDate, locale, timezone, dateFormat, false) }}
      </span>
      <span
        class="bookings-badges__dates-next"
        @click="onNextDate"
        :uk-tooltip="'title: ' + $t('bookings.components.filtersBadges.nextMonth')"
      >
        <core-svg :width="10" :src="require('@/assets/images/icons/arrow-right-range.svg')" />
      </span>
    </span>
    <span
      v-if="num > 0"
      class="uk-badge badge--success more"
      @click="$emit('click')"
      :uk-tooltip="'title: ' + moreTooltip"
    >
      {{ $t('bookings.components.filtersBadges.more', { num }) }}
    </span>

    <span class="uk-margin-auto-left cog" @click="$emit('click')">
      <core-svg width="16" height="16" :src="require('@/assets/images/icons/cog.svg')" />
    </span>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { formatCurrency, formatDate } from '@/utils/intl';
import dayjs from '@/utils/dayjs';
import useKit from '@/modules/core/composables/uikit';

export default {
  name: 'BookingsFiltersBadges',
  emits: ['click'],
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();

    const filters = computed(() => store.state.bookings.filters);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const defaultCurrency = computed(() => store.state.account.account.settings.currency);

    const isNotEmptyArray = (array) => Array.isArray(array) && array.length > 0;

    const num = computed(() => {
      const nums = [
        filters.value.statuses?.length > 0,
        (Number.isFinite(filters.value.priceMin) || Number.isFinite(filters.value.priceMax)),
        (isNotEmptyArray(filters.value.propertyIds)
          || isNotEmptyArray(filters.value.propertyUnitTypeIds)
          || isNotEmptyArray(filters.value.propertyUnitTypeUnitIds)),
      ].filter(Boolean);

      return nums.length;
    });

    const moreTooltip = computed(() => {
      const statuses = filters.value.statuses?.length
        ? filters.value.statuses
          .map((status) => i18n.t(`bookings.dicts.statuses.${status}`))
          .join(', ')
        : '';

      return [
        statuses && i18n.t('bookings.components.filtersBadges.statuses', {
          statuses,
        }),
        (Number.isFinite(filters.value.priceMin) && Number.isFinite(filters.value.priceMax))
          && i18n.t('bookings.components.filtersBadges.prices', {
            min: formatCurrency(filters.value.priceMin, defaultCurrency.value),
            max: formatCurrency(filters.value.priceMax, defaultCurrency.value),
          }),
        isNotEmptyArray(filters.value.propertyIds) && i18n.t('bookings.components.filtersBadges.properties', {
          count: filters.value.propertyIds.length,
        }),
      ].filter(Boolean).join(' | ');
    });

    const onPrevDate = () => {
      const startDate = dayjs.utc(filters.value.startDate)
        .tz(timezone.value)
        .subtract(1, 'months')
        .toISOString();

      const endDate = dayjs.utc(filters.value.endDate)
        .tz(timezone.value)
        .subtract(1, 'months')
        .endOf('month')
        .toISOString();

      store.commit('bookings/SET_FILTERS', {
        ...filters.value,
        startDate,
        endDate,
      });

      store.dispatch('bookings/setList')
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onNextDate = () => {
      const startDate = dayjs.utc(filters.value.startDate)
        .tz(timezone.value)
        .add(1, 'months')
        .toISOString();

      const endDate = dayjs.utc(filters.value.endDate)
        .tz(timezone.value)
        .add(1, 'months')
        .endOf('month')
        .toISOString();

      store.commit('bookings/SET_FILTERS', {
        ...filters.value,
        startDate,
        endDate,
      });

      store.dispatch('bookings/setList')
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    return {
      filters,
      num,
      locale,
      timezone,
      moreTooltip,
      dateFormat,

      formatDate,
      onPrevDate,
      onNextDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.bookings-badges {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-top: 6px;

  &__dates {
    padding: 0 4px;

    &-prev,
    &-next {
      cursor: pointer;
    }
  }

  .uk-badge {
    height: 16px;
    line-height: 16px;
    padding: 0 5px;
    margin: 0 2px;
  }

  .more {
    cursor: pointer;
  }

  .cog {
    display: flex;
    height: 16px;
    cursor: pointer;
    color: rgba($base-color-darken, 0.5);
    transition: 0.2s linear;

    &:hover {
      color: rgba($base-color-darken, 0.75);
    }
  }
}
</style>
