<template>
  <v-form
    ref="formRef"
    class="sidebar-form"
    name="bookingTax"
    @submit="onSubmit"
    v-slot="{ errors, values, setValues }"
    v-e2e
  >
    <h5 class="sidebar-form__title">{{ $t('bookings.components.taxForm.title') }}</h5>
    <core-form-autocomplete
      id="title"
      class="uk-margin-bottom"
      :data="dict"
      :label="$t('bookings.components.taxForm.name')"
      field="name"
      name="name"
      rules="required|max:191"
      :value="values.name"
      @search="onSearch"
      @select="onSelectTax($event); $event && setValues({ ...values, ...$event })"
    />

    <div class="uk-margin-bottom">
      <core-form-radio-group
        name="rateType"
        :items="calculationItems"
        :value="values.rateType || CALCULATION_TYPES.FLAT_FEE"
        v-e2e="'rateType'"
      />
    </div>

    <div class="uk-flex uk-flex-middle uk-flex-wrap">
      <template v-if="values.rateType === CALCULATION_TYPES.PERCENTAGE">
        <core-form-input-number
          class="uk-margin-bottom uk-margin-small-right"
          name="percentage"
          :label="$t('bookings.components.taxForm.percentage')"
          :placeholder="$t('bookings.components.taxForm.percentPlaceholder')"
          rules="required|between:0,100"
          suffix="%"
          float
          :min="0"
          :max="100"
          :value="values.percentage"
        />
        <p class="hint uk-margin-bottom">
          {{ $t('bookings.components.taxForm.applyHint') }}
        </p>
      </template>

      <template v-if="values.rateType === CALCULATION_TYPES.FLAT_FEE">
        <core-form-input-number
          name="amount"
          class="uk-margin-bottom uk-margin-right amount"
          :label="$t('bookings.components.taxForm.amount')"
          :placeholder="$t('bookings.components.taxForm.amountPlaceholder', {
            sign: currency,
          })"
          rules="required"
          :currency="currency"
          float
        />
        <div class="uk-margin-bottom uk-margin-right charge">
          <label for="chargeType" class="input-label" :class="{ '--invalid': errors.chargeType }">
            {{ $t('bookings.components.taxForm.charge') }}
            <span
              class="question-tooltip"
              uk-icon="icon: question; ratio: 0.5"
              :uk-tooltip="'title:' + $t('bookings.components.taxForm.chargeTooltip')"
            ></span>
          </label>
          <div class="input-container">
            <core-form-select
              id="chargeType"
              name="chargeType"
              :label="$t('bookings.components.taxForm.charge')"
              :class="{ '--invalid': errors.chargeType }"
              :value="TAX_CHARGE_TYPES.SINGLE_CHARGE"
              rules="required"
              :data="chargeTypes"
              :show-placeholder="false"
              :press-label="false"
            />
            <v-error-message class="input-error-message" name="chargeType" />
          </div>
        </div>
        <div class="uk-margin-bottom uk-margin-right charge">
          <label for="frequency" class="input-label" :class="{ '--invalid': errors.frequency }">
            {{ $t('bookings.components.taxForm.frequency') }}
            <span
              class="question-tooltip"
              uk-icon="icon: question; ratio: 0.5"
              :uk-tooltip="'title:' + $t('bookings.components.taxForm.frequencyTooltip')"
            ></span>
          </label>
          <div class="input-container">
            <core-form-select
              id="frequency"
              name="frequency"
              :label="$t('bookings.components.taxForm.frequency')"
              :class="{ '--invalid': errors.frequency }"
              :value="FREQUENCIES.PER_STAY"
              rules="required"
              :data="frequencies"
              :show-placeholder="false"
            />
            <v-error-message class="input-error-message" name="frequency" />
          </div>
        </div>
      </template>
    </div>

    <div class="uk-text-right">
      <button
        type="button"
        class="uk-button uk-button-link uk-margin-right"
        :disabled="loading"
        v-e2e="'cancel-tax'"
        @click="$emit('close')"
      >
        {{ $t('bookings.shared.cancel') }}
      </button>
      <button
        class="uk-button uk-button-primary"
        v-e2e="'create-tax'"
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('bookings.shared.save') }}
      </button>
    </div>
  </v-form>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ErrorMessage, Form } from 'vee-validate';
import { useStore } from 'vuex';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { CALCULATION_TYPES, TAX_CHARGE_TYPES, FREQUENCIES } from '@/modules/settings/services/fees';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import CoreFormAutocomplete from '@/modules/core/components/core-form/CoreFormAutocomplete.vue';
import { scrollToFirstInvalidControl } from '@/utils/form';
import { EXTRAS_TYPES } from '@/modules/bookings/services/extras';

export default {
  name: 'BookingsBookingTaxForm',
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormRadioGroup,
    CoreFormSelect,
    CoreFormInputNumber,
    CoreFormAutocomplete,
  },
  props: {
    bookingId: Number,
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const { formErrorFormatter } = useApiFormatters();

    const dict = ref([]);
    const formRef = ref(null);
    const loading = ref(false);

    const taxes = computed(() => store.state.settings.taxes.list);
    const extra = computed(() => store.state.bookings.extras.entity);

    const calculationItems = Object.values(CALCULATION_TYPES).map((key) => ({
      label: i18n.t(`settings.dicts.calculations.${key}`),
      value: key,
    }));

    const chargeTypes = Object.values(TAX_CHARGE_TYPES).map((key) => ({
      label: i18n.t(`settings.dicts.chargeTypes.${key}`),
      value: key,
    }));

    const frequencies = Object.values(FREQUENCIES).map((key) => ({
      label: i18n.t(`settings.dicts.frequencies.${key}`),
      value: key,
    }));

    const currency = computed(() => {
      if (store.state.bookings.entity?.currency) {
        return store.state.bookings.entity.currency;
      }

      return store.state.account.account?.settings.currency;
    });

    const onSearch = ({ query }) => {
      dict.value = taxes.value.filter((tax) => tax.name.toLowerCase().includes(query.toLowerCase()));
    };

    const onSelectTax = (tax) => {
      store.commit('settings/taxes/SET_ENTITY', tax);
    };

    const onSubmit = (values) => {
      loading.value = true;
      store.dispatch('bookings/extras/upsert', {
        bookingId: props.bookingId,
        data: { ...values, extrasType: EXTRAS_TYPES.TAX, currency: currency.value },
      })
        .then(() => uikit.notify('success', i18n.t('bookings.components.taxForm.success')))
        .then(() => Promise.all([
          store.dispatch('bookings/extras/setList', {
            bookingId: props.bookingId,
          }),
          store.dispatch('bookings/refreshEntity', props.bookingId),
        ]))
        .then(() => {
          emit('close');
          emit('save');
        })
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            formRef.value.setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => { loading.value = false; });
    };

    onMounted(async () => {
      await store.dispatch('settings/taxes/setList');

      if (extra.value) {
        formRef.value.setValues(extra.value);
        onSelectTax(extra.value);
      }
    });

    return {
      CALCULATION_TYPES,
      TAX_CHARGE_TYPES,
      FREQUENCIES,
      calculationItems,
      currency,
      chargeTypes,
      frequencies,
      dict,
      formRef,
      loading,

      onSelectTax,
      onSubmit,
      onSearch,
    };
  },
};
</script>
