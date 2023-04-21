<template>
  <div>
    <div>
      <input
        type="text"
        class="uk-input --outline"
        :class="{
          '--invalid': errors.length
        }"
        ref="dateInputRef"
        @click="onInputClick"
        :readonly="true"
        :placeholder="$t('core.components.formTimepicker.placeholder', {
          time: placeholderTime,
        })"
        :value="dateInputValue"
        v-e2e="name"
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
  toRef,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { useField } from 'vee-validate';

import dayjs from '@/utils/dayjs';
import { formatTime } from '@/utils/intl';
import { createPopupAndAttach, createTimepicker } from '@/utils/dhx';

export default {
  name: 'CoreFormTimepicker',
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
    rules: [String, Object, Function],
    value: {
      type: String,
    },
    defaultSeconds: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const rules = typeof props.rules === 'function' ? props.rules : toRef(props, 'rules');

    const getTime = (date, isAM) => dayjs(date, isAM ? 'hh:mmA' : 'HH:mm').format(`HH:mm:${props.defaultSeconds ? '00' : ''}`);

    const dateInputRef = ref(null);
    const dateInputValue = ref(null);

    const locale = computed(() => store.state.account.account.settings.locale);
    const timeFormat = computed(() => store.state.account.account.settings.timeFormat);
    const isAM = computed(() => store.state.account.account.settings.timeFormat === 12);
    const placeholderTime = computed(() => formatTime(dayjs().set('seconds', 0).toDate(), locale.value, undefined));
    const timezone = computed(() => store.getters['core/timezone']);

    const getDateTime = (time) => dayjs.utc(time, `HH:mm:${props.defaultSeconds ? '00' : ''}`).tz(timezone.value).toDate();

    const getValue = () => {
      if (props.value) {
        const time = getDateTime(props.value);

        return {
          hour: time.getHours(),
          minute: time.getMinutes(),
          AM: isAM.value,
        };
      }

      return undefined;
    };

    const {
      handleChange,
      errors,
      value: baseValue,
    } = useField(props.name, rules,
      {
        label: props.label,
        initialValue: props.value,
        validateOnValueUpdate: false,
      });

    let popup;
    let timepicker;

    onMounted(() => {
      if (props.value) {
        dateInputValue.value = formatTime(getDateTime(props.value), locale.value, timezone.value);
      }

      timepicker = createTimepicker({
        value: getValue(),
        timeFormat: timeFormat.value,
      });

      popup = createPopupAndAttach(timepicker);

      timepicker.events.on('change', () => {
        const time = timepicker.getValue();
        dateInputValue.value = time;

        handleChange(getTime(time, isAM.value));
      });
    });

    onUnmounted(() => {
      timepicker.destructor();
    });

    const onInputClick = () => popup.show(dateInputRef.value);

    watch(() => props.value, () => {
      if (timepicker) {
        timepicker.setValue(getValue());
      }
    });

    return {
      dateInputRef,
      dateInputValue,
      placeholderTime,

      handleChange,
      errors,
      baseValue,
      onInputClick,
    };
  },
};
</script>
