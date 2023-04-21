<template>
  <label class="form-switch">
    <input
      type="checkbox"
      class="form-switch__input"
      :checked="checked"
      @change="toggle"
      v-e2e="'switch'"
      :disabled="disabled"
    >
    <i class="form-switch__icon" :class="{ 'uk-margin-remove': !label }"></i>
    {{ label }}
  </label>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  name: 'CoreFormSwitcher',
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    name: {
      type: String,
      default: '',
    },
  },

  emits: ['change'],

  setup(props, { emit }) {
    const { handleChange } = useField(props.name, undefined, {
      initialValue: Number(props.checked),
    });

    const toggle = (e) => {
      if (props.disabled) return;

      handleChange(Number(e.target.checked));
      emit('change', e.target.checked);
    };

    return { toggle };
  },
};
</script>
