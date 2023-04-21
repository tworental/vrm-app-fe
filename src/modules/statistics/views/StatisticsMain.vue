<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('statistics.views.main.title')" icon="statistics">
        <div class="uk-margin-auto-left" v-if="!isHotel">
          <core-form-select
            name="property"
            class="properties-select"
            :data="properties"
            :placeholder="$t('statistics.views.main.allProperties')"
            @update:modelValue="onChangeProperty"
          />
        </div>
      </core-layout-content-header>
    </template>

    <template #placeholder>
      <core-placeholder
        image="statistics.svg"
        :title="$t('statistics.views.main.placeholder.title')"
        :label="$t('statistics.views.main.placeholder.label')"
        :description="$t('statistics.views.main.placeholder.description')"
      >
      </core-placeholder>
    </template>

    <template #default>
      <div class="statistics-content">
        <statistics-accommodation-revenue />
        <statistics-occupancy-per-month />
        <statistics-reservations-per-country />
        <statistics-pace-report />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { hasAccess, LIMITS } from '@/utils/acl';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import StatisticsAccommodationRevenue from '../components/StatisticsAccommodationRevenue.vue';
import StatisticsOccupancyPerMonth from '../components/StatisticsOccupancyPerMonth.vue';
import StatisticsPaceReport from '../components/StatisticsPaceReport.vue';
import StatisticsReservationsPerCountry from '../components/StatisticsReservationsPerCountry.vue';

export default {
  components: {
    CoreFormSelect,
    StatisticsAccommodationRevenue,
    StatisticsOccupancyPerMonth,
    StatisticsPaceReport,
    StatisticsReservationsPerCountry,
  },
  setup() {
    const store = useStore();

    const properties = computed(() => store.getters['rentals/rentals/autocompleteList']);
    const selectedProperty = computed(() => store.state.statistics.propertyId);
    const isHotel = computed(() => hasAccess(store.state.core.limits, LIMITS.APP_PROPERTIES_HOTEL_MODE_ENABLED));

    const onChangeProperty = (propertyId) => {
      store.dispatch('statistics/setProperty', propertyId);
    };

    return {
      isHotel,
      properties,
      selectedProperty,
      onChangeProperty,
    };
  },
};
</script>

<style lang="scss">
  .statistics {
    &-content {
      padding: 15px 18px;

      @include fromTablet {
        padding: 0 30px;
      }
    }
    &-chart svg {
      stroke: none;
    }
  }
  .chart-card {
    position: relative;
    background-color: $color-white;
    border: 1px solid rgba($alt-color, 0.2);
    margin-bottom: 18px;
    padding-top: 12px;

    &__header {
      padding: 2px 20px;

      @include fromTablet {
        display: flex;
        justify-content: space-between;
      }
    }

    &__content {
      padding: 2px 20px;
    }

    &__title {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      color: $base-color-darken;
      font-weight: 500;
      margin: 0;
    }
  }
  .properties-select {
    min-width: 300px;
  }
</style>
