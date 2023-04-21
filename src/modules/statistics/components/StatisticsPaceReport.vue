<template>
  <div class="chart-card">
    <div class="chart-card__header">
      <h4 class="chart-card__title">
        {{ $t('statistics.components.paceReport.title') }}
        <span
          class="uk-margin-small-left question-tooltip"
          uk-icon="icon: question; ratio: 0.5"
          :uk-tooltip="'title:' + $t('statistics.components.paceReport.label') + '; pos: right'"></span>
      </h4>
      <div v-if="possibleYears.length > 1" class="uk-flex uk-flex-middle uk-flex-right year-select">
        <statistics-year-select
          v-model="year"
          :color="secondYearTotalColor"
          :disabled-value="compareToYear"
          class="uk-margin-small-right"
          @update:modelValue="onYearChange"
        />
        <statistics-year-select
          v-model="compareToYear"
          :disabled-value="year"
          :color="firstYearTotalColor"
          @update:modelValue="onYearChange"
        />
      </div>
    </div>
    <apexchart
      class="statistics-chart"
      width="100%"
      height="500"
      type="line"
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

import { getEvents, getPaceTooltip, getStates } from '@/utils/chart';
import { formatCurrency } from '@/utils/intl';
import { getPossibleYears } from '@/modules/statistics/utils/years';
import StatisticsYearSelect from './StatisticsYearSelect.vue';

export default {
  components: {
    apexchart: VueApexCharts,
    StatisticsYearSelect,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();

    const compareToYear = ref(new Date().getFullYear() - 1);
    const year = ref(new Date().getFullYear());

    const firstYearTotalColor = ref('#b0b0b0');
    const firstYearAvgColor = ref('#5A80F9');

    const secondYearTotalColor = ref('#5A80F9');
    const secondYearAvgColor = ref('#FB4B56');

    const chartOptions = ref({
      chart: {
        id: 'pace-report',
        toolbar: {
          show: false,
        },
        events: getEvents(),
      },
      stroke: {
        curve: 'straight',
        width: 1,
      },
      xaxis: {
        labels: {
          style: {
            colors: 'rgba(62, 63, 66, 0.5)',
            fontFamily: 'Roboto, sans-serif',
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          labels: {
            style: {
              colors: 'rgba(62, 63, 66, 0.5)',
              fontFamily: 'Roboto, sans-serif',
            },
          },
        },
      ],
      colors: [
        firstYearTotalColor.value,
        firstYearAvgColor.value,
        secondYearTotalColor.value,
        secondYearAvgColor.value,
      ],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 5,
      },
      legend: {
        show: false,
      },
      tooltip: getPaceTooltip(
        (nights) => i18n.t('statistics.components.paceReport.nightsLabel', { nights }),
        (rate) => formatCurrency(
          rate,
          store.state.account.account?.settings.currency,
          store.state.account.account?.settings.locale,
        ),
      ),
      states: getStates(),
    });

    const mapSeries = (item) => [
      {
        name: i18n.t('statistics.components.paceReport.total', { year: item.year }),
        data: item.data.map((y, i) => ({ x: i18n.t(['statistics.dicts.months', item.labels[i]].join('.')), y })),
        type: 'column',
      },
      {
        name: i18n.t('statistics.components.paceReport.avg', { year: item.year }),
        data: item.averagePrice.map((y, i) => ({ x: i18n.t(['statistics.dicts.months', item.labels[i]].join('.')), y })),
        type: 'line',
      },
    ];

    const series = computed(() => {
      const emptyPace = store.state.statistics.pace.data.every((statistic) => !statistic.averagePrice.some(Boolean));

      if (emptyPace) {
        return [];
      }

      return store.state.statistics.pace.data.map(mapSeries).flat();
    });
    const loading = computed(() => store.state.statistics.pace.loading);
    const possibleYears = computed(() => getPossibleYears(store.state.account.account.createdAt));

    const onYearChange = () => {
      store.dispatch('statistics/setPace', {
        year: year.value,
        compareToYear: possibleYears.value.length > 1 ? compareToYear.value : null,
      });
    };

    onMounted(() => {
      onYearChange();
    });

    return {
      year,
      compareToYear,
      firstYearTotalColor,
      secondYearTotalColor,
      chartOptions,
      series,
      loading,
      possibleYears,

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
