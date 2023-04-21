<template>
  <div>
    <label
      v-if="label"
      class="input-label"
      :class="{ '--invalid': errors.length, '--required': rules && rules.includes('required') }"
    >
      {{ label }}
    </label>
    <div class="input-container">
      <InputNumber
        :mode="currency ? 'currency': 'decimal'"
        :modelValue="inputValue"
        :inputClass="'uk-input --outline ' + (errors.length ? '--invalid': '')"
        :placeholder="placeholder"
        :name="name"
        :suffix="!currency ? suffix : null"
        :locale="locale"
        :currency="currency"
        :min="min"
        :max="max"
        :disabled="disabled"
        :readonly="readonly"
        :minFractionDigits="float ? 2 : null"
        :maxFractionDigits="float ? maxFractionDigits : null"
        :step="step"
        @input="onInput"
        @update:modelValue="handleChange"
        v-e2e
      />
      <v-error-message v-if="showError" class="input-error-message" :name="name" />
    </div>
  </div>
</template>

<script>
import {
  computed, ref, toRef,
} from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, useField } from 'vee-validate';
import InputNumber from 'primevue/inputnumber';

export default {
  name: 'CoreFormInputNumber',
  props: {
    name: String,
    label: String,
    placeholder: String,
    rules: String,
    suffix: String,
    currency: String,
    min: Number,
    max: Number,
    disabled: Boolean,
    readonly: Boolean,
    float: Boolean,
    value: [String, Number],
    maxFractionDigits: {
      type: Number,
      default: 2,
    },
    step: {
      type: Number,
      default: 1,
    },
    validateOnValueUpdate: {
      type: Boolean,
      default: true,
    },
    showError: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    VErrorMessage: ErrorMessage,
    InputNumber,
  },
  emits: ['input'],
  setup(props, { emit }) {
    const store = useStore();

    const model = ref(props.value);

    const locale = computed(() => store.state.account.account.settings.locale);

    const rules = toRef(props, 'rules');

    const { value: inputValue, handleChange, errors } = useField(props.name, rules, {
      initialValue: props.value,
      validateOnValueUpdate: props.validateOnValueUpdate,
    });

    const onInput = ({ value }) => {
      let val = value;

      if (props.min !== null && props.min !== undefined && Number.isFinite(props.min)) {
        val = Math.max(props.min, Number(value));
      }

      if (props.max !== null && props.max !== undefined && Number.isFinite(props.max)) {
        val = Math.min(props.max, Number(value));
      }

      handleChange(val);
      emit('input', val);
    };

    return {
      inputValue,
      model,
      errors,
      locale,

      handleChange,
      onInput,
    };
  },
};
</script>
