<template>
  <label class="checkbox-label">
    <input
      v-e2e="'checkbox'"
      :checked="checked"
      :indeterminate="indeterminate"
      class="uk-checkbox"
      type="checkbox"
      @change="toggle"
      :disabled="disabled"
    />
    <span v-if="label" class="label-text" :class="{ '--small': small }">
      {{ label }}
      <span
        v-if="tooltip"
        class="tooltip question-tooltip"
        uk-icon="icon: question; ratio: 0.5"
        :uk-tooltip="'title:' + tooltip"
      ></span>
    </span>
  </label>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  name: 'CoreFormCheckbox',
  props: {
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    tooltip: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
    },
    indeterminate: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
    },
  },

  emits: ['change', 'update:modelValue'],

  setup(props, { emit }) {
    const { handleChange } = useField(props.name, undefined, {
      initialValue: Number(props.checked),
    });

    const toggle = (e) => {
      emit('change', e.target.checked);
      emit('update:modelValue', Number(e.target.checked));
      handleChange(Number(e.target.checked));
    };

    return { toggle };
  },
};
</script>
