<template>
  <div class="date-range">
    <div class="uk-flex">
      <label class="input-label --required" :class="{ '--invalid': errors[startDateKey] || errors[endDateKey] }">
        {{ startDateLabel || $t('core.components.formDateRange.startDay') }}
      </label>
      <label
        class="input-label dash"
        :class="{ '--invalid': errors[startDateKey] || errors[endDateKey] }"
      >
        -
      </label>
      <label class="input-label --required" :class="{ '--invalid': errors[startDateKey] || errors[endDateKey] }">
        {{ endDateLabel || $t('core.components.formDateRange.endDay') }}
      </label>
    </div>

    <div class="input-container">
      <input
        type="text"
        ref="dateInputRef"
        @click="onInputClick"
        @input="onInputChange"
        class="uk-input --outline"
        :class="{ '--invalid': startDateErrors.length + endDateErrors.length }"
        :value="dateInputValue"
        :placeholder="$t('core.components.formDateRange.placeholder', {
          start: placeholderDates[0],
          end: placeholderDates[1],
        })"
        v-mask="dateFormat ? DATE_FORMAT_RANGE_MASKS[dateFormat] : DATE_FORMAT_RANGE_MASKS[DATE_FORMATS.auto]"
        v-e2e="startDateKey + '-' + endDateKey"
      />
      <v-error-message
        v-if="startDateErrors.length"
        class="input-error-message"
        :name="startDateKey"
      />
      <v-error-message
        v-if="!startDateErrors.length && endDateErrors.length"
        class="input-error-message"
        :name="endDateKey"
      />

      <core-svg
        class="uk-position-center-right date-picker-icon"
        :width="24"
        :src="require('@/assets/images/icons/datepicker.svg')"
      />
    </div>
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import dayjs from '@/utils/dayjs';
import {
  formatDate,
  formatDateForInput,
  getDateFromUtcByFormat,
} from '@/utils/intl';
import { dateRangeOverlaps, getMinDateForEndDateInput } from '@/utils/datetime';
import { createCalendar, createPopupAndAttach } from '@/utils/dhx';
import { getLocaleDatePattern } from '@/utils/date-formats';
import { DATE_FORMAT_RANGE_MASKS, DATE_FORMATS } from '@/modules/account/services';

export default {
  name: 'CoreFormDateRange',
  props: {
    formValues: Object,
    errors: Object,
    ranges: {
      type: Array,
      default: () => [],
    },
    startDateValue: String,
    endDateValue: String,
    startDateLabel: String,
    endDateLabel: String,
    startDateKey: {
      type: String,
      default: 'startDate',
    },
    endDateKey: {
      type: String,
      default: 'endDate',
    },
    disablePastDays: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    VErrorMessage: ErrorMessage,
  },
  emits: ['setValues', 'change'],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();

    const dateInputRef = ref(null);
    const dateInputValue = ref(null);
    const dateOnHover = ref(null);

    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    const measuringUnits = computed(() => store.state.account.account.settings.measuringUnits);
    const placeholderDates = computed(() => [
      formatDate(dayjs().add(1, 'days').toDate(), locale.value, undefined, dateFormat.value, false),
      formatDate(dayjs().add(5, 'days').toDate(), locale.value, undefined, dateFormat.value, false),
    ]);

    const doesOverlap = (ctx) => {
      const startDate = ctx.form[props.startDateKey];
      const endDate = ctx.form[props.endDateKey];

      if (!startDate || !endDate) return false;

      return props.ranges.some(
        (range) => dateRangeOverlaps(
          dayjs(startDate)
            .toDate(),
          dayjs(endDate)
            .toDate(),
          dayjs(range.startDate)
            .toDate(),
          dayjs(range.endDate)
            .toDate(),
        ),
      );
    };

    // required + overlap
    const validateStartDate = (date, ctx) => {
      if (!date) return false;

      if (!dayjs(date, 'YYYY-MM-DD').isValid()) return false;

      if (props.disablePastDays && dayjs(date).diff(dayjs(), 'days') < 0) return false;

      return doesOverlap(ctx) ? i18n.t('core.errors.overlap') : true;
    };

    // required|min_date:startDate + overlap
    const validateEndDate = (date, ctx) => {
      if (!date) return false;

      const end = dayjs(date, 'YYYY-MM-DD');
      const start = dayjs(ctx.form[props.startDateKey], 'YYYY-MM-DD');

      if (!end.isAfter(start)) {
        return false;
      }

      return doesOverlap(ctx) ? i18n.t('core.errors.overlap') : true;
    };

    const startDateField = useField(props.startDateKey, validateStartDate, {
      initialValue: props.startDateValue,
      label: props.startDateLabel || i18n.t('core.components.formDateRange.startDay'),
    });

    const endDateField = useField(props.endDateKey, validateEndDate, {
      initialValue: props.endDateValue,
      label: props.endDateLabel || i18n.t('core.components.formDateRange.endDay'),
    });

    const getValue = () => ((props.startDateValue && props.endDateValue)
      ? [
        getDateFromUtcByFormat(props.startDateValue, timezone.value),
        getDateFromUtcByFormat(props.endDateValue, timezone.value),
      ]
      : undefined);

    let calendar;
    let popup;

    onMounted(() => {
      if (props.startDateValue && props.endDateValue) {
        dateInputValue.value = `${formatDate(getDateFromUtcByFormat(props.startDateValue, timezone.value), locale.value, undefined, dateFormat.value, false)} - ${formatDate(getDateFromUtcByFormat(props.endDateValue, timezone.value), locale.value, undefined, dateFormat.value, false)}`;
      }

      calendar = createCalendar({
        value: getValue(),
        range: true,
        disabledDates: (date) => (props.disablePastDays && dayjs(date).diff(dayjs(), 'days') < 0),
        mark: (date) => {
          if (dateOnHover.value && startDateField.value.value && !endDateField.value.value) {
            if (dayjs(date).isAfter(dayjs(startDateField.value.value))) {
              if (dayjs(dateOnHover.value).isAfter(date)) {
                return 'dhx_calendar-day--in-range';
              }

              if (dayjs(dateOnHover.value).isSame(date)) {
                return 'dhx_calendar-day--in-range dhx_calendar-day--selected dhx_calendar-day--selected-last';
              }
            } else if (dayjs(startDateField.value.value).isSame(date) && dayjs(dateOnHover.value).isAfter(date)) {
              return 'dhx_calendar-day--in-range';
            }
          }

          return '';
        },
      }, measuringUnits.value);

      popup = createPopupAndAttach(calendar);

      calendar.events.on('change', () => {
        const dates = calendar.getValue();

        startDateField.handleChange(dates[0] ? dayjs.tz(dates[0], 'YYYY-MM-DD', timezone.value).utc().toISOString() : undefined);
        endDateField.handleChange(dates[1] ? dayjs.tz(dates[1], 'YYYY-MM-DD', timezone.value).utc().toISOString() : undefined);

        startDateField.validate();
        endDateField.validate();

        if (dates.length === 2) {
          dateInputValue.value = `${formatDate(dates[0], locale.value, undefined, dateFormat.value, false)} - ${formatDate(dates[1], locale.value, undefined, dateFormat.value, false)}`;

          popup.hide();

          emit('change');
        } else {
          dateInputValue.value = null;
        }
      });

      calendar.events.on('DateMouseOver', (e) => {
        dateOnHover.value = e;
        calendar.paint();
      });
    });

    const isDateValid = (inputDate) => {
      const format = getLocaleDatePattern(locale.value);

      if (inputDate.length !== format.length) {
        return false;
      }

      const dayjsObj = dayjs(inputDate, 'L').locale(locale.value);

      return dayjsObj.isValid();
    };

    const getLocaleDate = (date) => dayjs(date, 'L').locale(locale.value).toDate();

    const onInputChange = (e) => {
      const [start, end] = (e.target.value || '').split(' - ');

      if (!start || !end || !isDateValid(start) || !isDateValid(end)) {
        startDateField.setErrors(i18n.t('core.errors.invalid'));
        dateInputValue.value = e.target.value;

        return;
      }

      calendar.setValue([getLocaleDate(start), getLocaleDate(end)]);
    };

    onUnmounted(() => {
      calendar.destructor();
    });

    const onInputClick = () => popup.show(dateInputRef.value);

    return {
      DATE_FORMATS,
      DATE_FORMAT_RANGE_MASKS,
      dateInputRef,
      dateInputValue,
      startDateErrors: startDateField.errors,
      endDateErrors: endDateField.errors,
      placeholderDates,
      dateFormat,

      formatDateForInput,
      getMinDateForEndDateInput,
      doesOverlap,
      validateStartDate,
      validateEndDate,
      onInputClick,
      onInputChange,
    };
  },
};
</script>
