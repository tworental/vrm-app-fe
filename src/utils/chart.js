export const getEvents = () => ({
  mounted() {
    window.dispatchEvent(new Event('resize'));
  },
});

export const getCompareTooltip = (formatter = null) => ({
  custom: ({
    series,
    dataPointIndex,
    w,
  }) => {
    const extra = series[1]
      ? `
      <span class="uk-flex uk-flex-middle tooltip-item --darken">
          <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[1]}"></span>
          <span>${formatter ? formatter(series[1][dataPointIndex], dataPointIndex, 1) : series[1][dataPointIndex]}</span>
      </span>
      `
      : '';

    return `
    <span class="uk-flex uk-flex-middle tooltip-item">
        <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[0]}"></span>
        <span>${formatter ? formatter(series[0][dataPointIndex], dataPointIndex, 0) : series[0][dataPointIndex]}</span>
    </span>
    ${extra}
    `;
  },
});

export const getPaceTooltip = (nightsFormatter = null, rateFormatter = null) => ({
  custom: ({
    series,
    dataPointIndex,
    w,
  }) => {
    const extraTooltipItem1 = series[1]
      ? `
      <span class="uk-flex uk-flex-middle tooltip-item">
          <span class="apexcharts-tooltip-marker --line" style="background-color: ${w.config.colors[1]};color: ${w.config.colors[1]}"></span>
          <span>${rateFormatter ? rateFormatter(series[1][dataPointIndex]) : series[1][dataPointIndex]}</span>
      </span>`
      : '';

    const extraTooltipItem2 = series[2]
      ? `
      <span class="uk-flex uk-flex-middle tooltip-item --darken">
          <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[2]}"></span>
          <span>${nightsFormatter ? nightsFormatter(series[2][dataPointIndex]) : series[2][dataPointIndex]}</span>
      </span>`
      : '';

    const extraTooltipItem3 = series[3]
      ? `
      <span class="uk-flex uk-flex-middle tooltip-item --darken">
          <span class="apexcharts-tooltip-marker --line" style="background-color: ${w.config.colors[3]};color: ${w.config.colors[3]}"></span>
          <span>${rateFormatter ? rateFormatter(series[3][dataPointIndex]) : series[3][dataPointIndex]}</span>
      </span>`
      : '';

    return `
    <span class="uk-flex uk-flex-middle tooltip-item">
        <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[0]}"></span>
        <span>${nightsFormatter ? nightsFormatter(series[0][dataPointIndex]) : series[0][dataPointIndex]}</span>
    </span>
    ${extraTooltipItem1}
    ${extraTooltipItem2}
    ${extraTooltipItem3}
    `;
  },
});

export const getStates = () => ({
  active: {
    filter: {
      type: 'none',
    },
  },
});

export default {
  getEvents,
  getCompareTooltip,
  getPaceTooltip,
  getStates,
};
