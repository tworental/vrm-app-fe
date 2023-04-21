<template>
  <div>
    <input
      ref="inputRef"
      type="tel"
      class="uk-input --outline"
      :class="{ '--invalid': errors?.length }"
      :name="name"
      @input="onInput"
      @change="handleChange"
      @blur="handleBlur"
      :value="inputValue"
      :disabled="disabled"
      v-e2e
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import intlTelInput from 'intl-tel-input';
import { useStore } from 'vuex';

export default {
  name: 'CoreFormPhoneNumber',
  components: {
  },
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
    required: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
    },
  },
  setup(props) {
    let itl;

    const store = useStore();
    const i18n = useI18n();
    const inputRef = ref(null);

    const {
      value: inputValue,
      handleChange,
      handleBlur,
      handleReset,
      errors,
    } = useField(props.name, () => {
      if (props.disabled) {
        return true;
      }

      if (!props.required && (!itl || itl.getNumber().trim().length === 0)) {
        return true;
      }

      if (!itl) { return true; }

      const isValid = itl.isValidNumber();

      if (typeof isValid !== 'boolean') { return true; }

      return isValid || i18n.t('core.components.phoneNumber.error');
    }, {
      initialValue: props.value,
      label: props.label || props.name,
    });

    onMounted(() => {
      itl = intlTelInput(inputRef.value, {
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.min.js',
        nationalMode: false,
        initialCountry: store.state.account?.account?.settings?.countryCode || '',
      });
    });

    const onInput = () => {
      handleChange(itl.getNumber());
    };

    return {
      inputRef,
      itl,
      inputValue,
      errors,
      handleChange,
      handleBlur,
      handleReset,
      onInput,
    };
  },
};
</script>
