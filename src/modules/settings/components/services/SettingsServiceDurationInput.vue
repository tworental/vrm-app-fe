<template>
  <div>
    <label
      v-if="label"
      class="input-label"
      :class="{ '--invalid': errors[name] }"
    >
      {{ label }}
    </label>
    <div class="input-container">
      <core-form-select
        :id="name"
        :name="name"
        :label="$t('core.components.ratesDetails.currency')"
        :class="{ '--invalid': errors[name] }"
        :value="value"
        :data="data"
        :disabled="disabled"
        :placeholder="placeholder"
        :press-label="false"
        :search="true"
      />
      <v-error-message class="input-error-message" :name="name" />
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';

import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import { getHHMMFromMinutes } from '@/utils/datetime';

export default {
  name: 'SettingsServiceDurationInput',
  props: {
    name: String,
    label: String,
    placeholder: String,
    disabled: Boolean,
    value: String,
    errors: Object,
  },
  components: {
    CoreFormSelect,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const MAX_TIME = 30 * 60;
    const PERIOD = 15;
    const data = new Array((MAX_TIME / PERIOD) + 1)
      .fill(0)
      .map((item, index) => ({
        label: getHHMMFromMinutes(index * PERIOD),
        value: getHHMMFromMinutes(index * PERIOD),
      }));

    return { data };
  },
};
</script>
