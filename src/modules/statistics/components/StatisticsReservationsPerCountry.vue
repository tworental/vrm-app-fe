<template>
  <div class="chart-card">
    <div class="chart-card__header">
      <h4 class="chart-card__title">
        {{ $t('statistics.components.reservationsPerCountry.title') }}
        <span
          class="uk-margin-small-left question-tooltip"
          uk-icon="icon: question; ratio: 0.5"
          :uk-tooltip="'title:' + $t('statistics.components.reservationsPerCountry.label') + '; pos: right'"></span>
      </h4>
      <div v-if="possibleYears.length > 1" class="uk-flex uk-flex-middle uk-flex-right year-select">
        <statistics-year-select
          v-model="year"
          :color="secondYearColor"
          :disabled-value="compareToYear"
          class="uk-margin-small-right"
          @update:modelValue="onYearChange"
        />
        <statistics-year-select
          v-model="compareToYear"
          :disabled-value="year"
          :color="firstYearColor"
          @update:modelValue="onYearChange"
        />
      </div>
    </div>
    <apexchart
      class="statistics-chart"
      width="100%"
      height="350"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <div class="uk-overlay-default uk-position-cover" v-if="loading">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { getEvents, getCompareTooltip, getStates } from '@/utils/chart';
import { formatCurrency, getCountryNameByCode } from '@/utils/intl';
import { getPossibleYears } from '@/modules/statistics/utils/years';
import StatisticsYearSelect from './StatisticsYearSelect.vue';

export default {
  components: {
    apexchart: VueApexCharts,
    StatisticsYearSelect,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();

    const firstYearColor = '#5A80F9';
    const secondYearColor = '#b0b0b0';

    const compareToYear = ref(new Date().getFullYear() - 1);
    const year = ref(new Date().getFullYear());

    const chartOptions = ref({
      chart: {
        id: 'reservations-per-country',
        stackType: 'normal',
        toolbar: {
          tools: {
            download: false,
          },
        },
        events: getEvents(),
      },
      xaxis: {
        labels: {
          style: {
            colors: 'rgba(62, 63, 66, 0.5)',
            fontFamily: 'Roboto, sans-serif',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: 'rgba(62, 63, 66, 0.5)',
            fontFamily: 'Roboto, sans-serif',
          },
        },
      },
      colors: [firstYearColor, secondYearColor],
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '40px',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: getCompareTooltip(
        (rate, dataIdx, seriesIdx) => i18n.t('statistics.components.reservationsPerCountry.rate', {
          rate: `${(rate || 0).toFixed(2)}%`,
          price: formatCurrency(
            store.state.statistics.reservations.data[seriesIdx].averageRate[dataIdx],
            store.state.account.account?.settings.currency,
            store.state.account.account?.settings.locale,
          ),
        }),
      ),
      states: getStates(),
    });

    const mapSeries = (item) => ({
      name: item.year,
      data: item.data.map((y, i) => ({ x: getCountryNameByCode(item.labels[i], i18n.t('statistics.components.reservationsPerCountry.others')), y })),
    });

    const series = computed(() => store.state.statistics.reservations.data.map(mapSeries));
    const loading = computed(() => store.state.statistics.reservations.loading);
    const possibleYears = computed(() => getPossibleYears(store.state.account.account.createdAt));

    const onYearChange = () => {
      store.dispatch('statistics/setReservations', {
        year: year.value,
        compareToYear: possibleYears.value.length > 1 ? compareToYear.value : null,
      });
    };

    onMounted(() => {
      onYearChange();
    });

    return {
      possibleYears,
      firstYearColor,
      secondYearColor,
      year,
      compareToYear,
      chartOptions,
      series,
      loading,

      onYearChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.year-select {
  @include toTablet {
    margin: 10px 0 0;
  }
}
</style>
