<template>
  <div :class="{ '--press-label': pressLabel }" v-e2e="'select-' + name">
    <select
      ref="selectRef"
      :name="name"
      @change="onChange"
      :multiple="multiple"
      v-e2e
    >
      <option value="" v-if="showPlaceholder">{{ placeholder || $t('core.components.select.select') }}</option>
    </select>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useField } from 'vee-validate';

import { create } from '@/utils/choices';

export default {
  name: 'CoreFormSelect',
  props: {
    name: {
      type: String,
    },
    rules: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: [String, Number, Array],
    pressLabel: {
      type: Boolean,
      default: true,
    },
    showPlaceholder: {
      type: Boolean,
      default: true,
    },
    options: Object,
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  components: {
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const i18n = useI18n();
    const { handleChange, value } = useField(props.name, props.rules, {
      initialValue: props.value,
      label: props.label,
    });

    const selectRef = ref(null);

    let choice;

    const onChange = (e) => {
      if (!props.multiple) {
        handleChange(e.target.value);
        emit('update:modelValue', e.target.value);
      } else {
        const values = Array.from(e.target.options).map((option) => option.value);
        handleChange(values);
        emit('update:modelValue', values);
      }

      emit('change', e);
    };

    onMounted(() => {
      choice = create(selectRef.value, {
        searchEnabled: props.search,
        itemSelectText: props.pressLabel ? i18n.t('core.components.select.press') : '',
        loadingText: '',
        noChoicesText: i18n.t('core.components.select.noItems'),
        noResultsText: i18n.t('core.components.select.noItems'),
        searchFields: ['label'],
        searchChoices: true,
        shouldSort: false,
        ...(props.options || {}),
      });

      choice.setChoices(props.data, 'value', 'label', false);

      if (props.disabled) {
        choice.disable();
      }

      choice.setChoiceByValue(props.value);

      choice.passedElement.element.addEventListener(
        'hideDropdown',
        () => {
          if (props.search) {
            choice.clearInput();
          }
        },
        false,
      );
    });

    const refreshValue = () => {
      choice.setChoiceByValue(props.value);
    };

    watch(() => props.value, (val) => {
      if (!choice) return;
      choice.setChoiceByValue(val !== null && val !== undefined ? val : '');
    });

    watch(() => props.data, (data) => {
      if (!choice) return;

      choice.setChoices([
        props.showPlaceholder && { label: props.placeholder || i18n.t('core.components.select.select'), value: '', placeholder: true },
        ...data,
      ].filter(Boolean), 'value', 'label', true);

      if (value.value) {
        const item = data.find((selectItem) => selectItem.value.toString() === value.value);

        if (item && item.disabled) {
          choice.setChoiceByValue('');
          handleChange('');
        }
      }
    });

    watch(() => props.disabled, (val) => {
      if (val) {
        choice.disable();
      } else {
        choice.enable();
      }
    });

    return {
      selectRef,
      onChange,
      refreshValue,
    };
  },
};
</script>
