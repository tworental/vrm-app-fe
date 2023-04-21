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
      <AutoComplete
        v-model="selectedValue"
        :suggestions="data"
        :field="field"
        :class="{ '--invalid': errors.length }"
        @complete="search($event)"
        @update:modelValue="onSelect"
      >
        <template #item="slotProps">
          <slot name="item" v-bind="slotProps"></slot>
        </template>
      </AutoComplete>
      <v-error-message class="input-error-message" :name="name" />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import { ErrorMessage, useField } from 'vee-validate';

export default {
  name: 'CoreFormAutocomplete',
  props: {
    data: Array,
    field: String,
    name: String,
    rules: String,
    value: String,
    label: String,
  },
  components: {
    VErrorMessage: ErrorMessage,
    AutoComplete,
  },
  emits: ['search', 'select'],
  setup(props, { emit }) {
    const { handleChange, errors } = useField(props.name, props.rules);

    const selectedValue = ref(props.value || null);

    const search = (event) => {
      emit('search', event);
    };

    const onSelect = (event) => {
      handleChange(typeof event === 'object' ? event[props.name] : selectedValue.value);
      emit('select', typeof event === 'object' ? event : null);
    };

    watch(() => props.value, () => {
      selectedValue.value = props.value;
    });

    return {
      selectedValue,
      errors,

      search,
      onSelect,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
