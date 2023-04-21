<template>
  <div class="uk-position-relative">
    <input
      type="text"
      ref="dateInputRef"
      @click="onInputClick"
      class="uk-input --outline"
      :class="{
        '--invalid': errors.length,
        '--small': small,
      }"
      :value="dateInputValue"
      :placeholder="$t('core.components.formDatepicker.placeholder', { date: placeholderDate })"
      @input="onInputChange"
      v-mask="dateFormat ? DATE_FORMAT_MASKS[dateFormat] : DATE_FORMAT_MASKS[DATE_FORMATS.auto]"
      v-e2e="name"
    />
    <core-svg
      class="uk-position-center-right date-picker-icon"
      :width="24"
      :src="require('@/assets/images/icons/datepicker.svg')"
    />
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  toRef,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import dayjs from '@/utils/dayjs';
import { formatDate, formatDateForInput } from '@/utils/intl';
import { getDateFromFormat } from '@/utils/datetime';
import { createCalendar, createPopupAndAttach } from '@/utils/dhx';
import { getLocaleDatePattern } from '@/utils/date-formats';
import { DATE_FORMAT_MASKS, DATE_FORMATS } from '@/modules/account/services';

export default {
  name: 'CoreFormDatepicker',
  props: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    label: {
      type: String,
      default: '',
    },
    min: {
      type: String,
      default: null,
    },
    max: {
      type: String,
      default: null,
    },
    rules: [String, Object, Function],
    value: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(props) {
    const store = useStore();
    const i18n = useI18n();

    const dateInputRef = ref(null);
    const dateInputValue = ref(null);

    const locale = computed(() => store.state.account.account.settings.locale);
    const measuringUnits = computed(() => store.state.account.account.settings.measuringUnits);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const placeholderDate = computed(
      () => formatDate(new Date(), locale.value, timezone.value, dateFormat.value, false),
    );

    const rules = typeof props.rules === 'function' ? props.rules : toRef(props, 'rules');

    const {
      handleChange,
      errors,
      value: baseValue,
      setErrors,
    } = useField(props.name, rules,
      { label: props.label, initialValue: props.value, validateOnValueUpdate: false });

    const defaultMax = formatDateForInput(dayjs().add(5, 'years'));

    let calendar;
    let popup;

    onMounted(() => {
      if (props.value) {
        dateInputValue.value = formatDate(props.value, locale.value, undefined, dateFormat.value, false);
      }

      calendar = createCalendar({
        value: props.value,
        date: props.max ? dayjs(props.max).toDate() : undefined,
        disabledDates: (date) => {
          if (props.min && props.max) {
            return !dayjs(date).isBetween(dayjs(props.min), dayjs(props.max));
          }

          if (props.min) {
            return !dayjs(date).isBetween(dayjs(props.min), dayjs(defaultMax));
          }

          if (props.max) {
            return !dayjs(date).isBefore(dayjs(props.max));
          }

          return false;
        },
      }, measuringUnits.value);

      popup = createPopupAndAttach(calendar);

      calendar.events.on('change', () => {
        const value = calendar.getValue();
        dateInputValue.value = formatDate(value, locale.value, undefined, dateFormat.value, false);
        handleChange(value);
        popup.hide();
      });
    });

    onUnmounted(() => {
      calendar.destructor();
    });

    const onInputClick = () => popup.show(dateInputRef.value);

    const onInputChange = (event) => {
      const inputDate = event.target.value || '';
      const format = getLocaleDatePattern(locale.value);

      if (inputDate.length !== format.length) {
        setErrors(i18n.t('core.errors.invalid'));
        dateInputValue.value = inputDate;
        return;
      }

      const dayjsObj = dayjs(inputDate, 'L').locale(locale.value);

      if (dayjsObj.isValid()) {
        calendar.setValue(dayjsObj.format('YYYY-MM-DD'));
        return;
      }

      setErrors(i18n.t('core.errors.invalid'));
      dateInputValue.value = inputDate;
    };

    watch(() => props.value, (value) => {
      if (calendar) {
        calendar.setValue(value);
      }
    });

    watch(() => [props.min, props.max], () => {
      calendar.paint();
    });

    return {
      DATE_FORMATS,
      DATE_FORMAT_MASKS,
      dateInputRef,
      dateInputValue,
      defaultMax,
      placeholderDate,
      dateFormat,

      getDateFromFormat,
      handleChange,
      errors,
      baseValue,
      onInputClick,
      onInputChange,
    };
  },
};
</script>
