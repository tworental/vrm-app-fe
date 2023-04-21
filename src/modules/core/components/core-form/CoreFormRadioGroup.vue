<template>
  <div class="radio-group">
    <label
      class="radio-label"
      :class="{ '--big': big }"
      v-for="(item, index) in items"
      :key="index"
    >
      <input
        class="uk-radio"
        type="radio"
        :name="name"
        :label="label || name"
        :value="item.value"
        :checked="item.value === value"
        @change="onChange"
        v-e2e
        :disabled="disabled"
      />
      <span v-if="item.label" class="label-text">{{ item.label }}</span>
    </label>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  name: 'CoreFormRadioGroup',
  props: {
    name: {
      type: String,
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
    },
    items: {
      type: Array,
    },
    rules: {
      type: String,
    },
    big: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { handleChange } = useField(props.name, props.rules, { initialValue: props.value });

    const onChange = (e) => handleChange(e.target.value);

    return {
      onChange,
      handleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.radio-group {
  height: 40px;
  display: flex;
  align-items: center;
}
.radio-label {
  padding-right: 10px;

  &.--big {
    padding-right: 30px;

    .uk-radio {
      margin-top: -4px;
    }
    .label-text {
      padding-left: 10px;
      font-size: 1rem;
    }
  }
}
.label-text {
  font-size: 0.75rem;
  padding: 0 4px;
}
</style>
