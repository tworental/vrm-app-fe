<template>
  <div class="chart-card">
    <div class="chart-card__header">
      <h4 class="chart-card__title">
        {{ $t('statistics.components.accommodationRevenue.title.' + chartType) }}
        <span
          class="uk-margin-small-left question-tooltip"
          uk-icon="icon: question; ratio: 0.5"
          :uk-tooltip="'title:' + $t('statistics.components.accommodationRevenue.label.' + chartType) + '; pos: right'"
        ></span>
      </h4>
      <div class="uk-flex uk-flex-middle uk-flex-right uk-flex-wrap">
        <div v-if="possibleYears.length > 1" class="uk-flex uk-flex-middle">
          <statistics-year-select
            v-model="year"
            :color="secondYearColor"
            :disabled-value="compareToYear"
            class="uk-margin-medium-left uk-margin-small-right"
            @update:model-value="onYearChange"
          />
          <statistics-year-select
            v-model="compareToYear"
            :disabled-value="year"
            :color="firstYearColor"
            @update:model-value="onYearChange"
          />
        </div>
      </div>
    </div>
    <div class="chart-card__content uk-flex uk-flex-bottom">
      <h4 class="uk-margin-remove chart-sum">
        {{ secondYearTotal ? formatCurrency(secondYearTotal, currency, locale) : '-' }}
      </h4>
      <small class="uk-margin-small-left" v-if="changePercent">
        <div class="arrow-up" v-if="firstYearTotal < secondYearTotal" />
        <div class="arrow-down" v-if="firstYearTotal > secondYearTotal" />
        {{ changePercent }}%
      </small>
      <small class="uk-margin-small-left" v-if="firstYearTotal != null">
        ({{ formatCurrency(firstYearTotal, currency, locale) }})
      </small>
    </div>
    <apexchart
      class="statistics-chart"
      width="100%"
      height="500"
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
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { getEvents, getCompareTooltip, getStates } from '@/utils/chart';
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

    const firstYearColor = '#b0b0b0';
    const secondYearColor = '#5A80F9';

    const chartType = ref(store.state.statistics.revenue.type);

    const compareToYear = ref(new Date().getFullYear() - 1);
    const year = ref(new Date().getFullYear());

    const chartOptions = ref({
      chart: {
        id: 'accommodation-revenue',
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
          columnWidth: '60px',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 450,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '80%',
              },
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '50%',
              },
            },
          },
        },
      ],
      tooltip: getCompareTooltip((value) => formatCurrency(
        value,
        store.state.account.account?.settings.currency,
        store.state.account.account?.settings.locale,
      )),
      states: getStates(),
      series: [],
    });

    const locale = computed(() => store.state.account.account.settings.locale);
    const possibleYears = computed(() => getPossibleYears(store.state.account.account.createdAt));

    const mapSeries = (item) => ({
      name: item.year,
      data: item.data.map((y, i) => ({ x: i18n.t(['statistics.dicts.months', item.labels[i]].join('.')), y })),
    });

    const series = computed(() => store.state.statistics.revenue.data.map(mapSeries));

    const firstYearTotal = computed(() => store.state.statistics.revenue.data[0]?.total);
    const secondYearTotal = computed(() => store.state.statistics.revenue.data[1]?.total);
    const changePercent = computed(() => store.state.statistics.revenue.data[1]?.change);
    const loading = computed(() => store.state.statistics.revenue.loading);
    const currency = computed(() => store.state.account.account?.settings.currency);

    const chartSelectItems = [
      { label: i18n.t('statistics.components.accommodationRevenue.revenue'), value: 'income' },
      { label: i18n.t('statistics.components.accommodationRevenue.nights'), value: 'nights' },
    ];

    const onChartTypeChange = (type) => {
      store.dispatch('statistics/setRevenueType', {
        type,
        year: year.value,
        compareToYear: possibleYears.value.length > 1 ? compareToYear.value : null,
      });
    };

    const onYearChange = () => {
      store.dispatch('statistics/setRevenue', {
        year: year.value,
        compareToYear: possibleYears.value.length > 1 ? compareToYear.value : null,
      });
    };

    onMounted(() => {
      onYearChange();
    });

    return {
      chartType,
      firstYearColor,
      secondYearColor,
      compareToYear,
      year,
      firstYearTotal,
      secondYearTotal,
      changePercent,
      loading,
      chartOptions,
      currency,
      series,
      chartSelectItems,
      locale,
      possibleYears,

      onChartTypeChange,
      onYearChange,
      formatCurrency,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart-sum {
  line-height: 1.3;
}
.chart-switcher {
  @include toTablet {
    margin: 10px 0;
  }
}
.arrow-up,
.arrow-down {
  margin-bottom: 2px;
  margin-right: 3px;
  width: 0;
  height: 0;
  display: inline-block;
}

.arrow-up {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid $success-color;
}

.arrow-down {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid $error-color;
}
</style>
