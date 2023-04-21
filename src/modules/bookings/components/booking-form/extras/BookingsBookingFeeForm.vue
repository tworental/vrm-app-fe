<template>
  <v-form
    ref="formRef"
    class="sidebar-form"
    name="bookingFee"
    @submit="onSubmit"
    v-slot="{ errors, values, setErrors, setValues }"
    v-e2e
  >
    <h5 class="sidebar-form__title">{{ $t('bookings.components.feeForm.title') }}</h5>
    <core-form-autocomplete
      id="title"
      class="uk-margin-bottom"
      :data="dict"
      :label="$t('bookings.components.feeForm.name')"
      field="name"
      name="name"
      rules="required|max:191"
      :value="values.name"
      @search="onSearch"
      @select="onSelectFee($event); $event && setValues({ ...values, ...$event, })"
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
          :label="$t('bookings.components.feeForm.percentage')"
          name="percentage"
          :placeholder="$t('bookings.components.feeForm.percentPlaceholder')"
          rules="required|between:0,100"
          :min="0"
          :max="100"
          :value="values.percentage"
          suffix="%"
        />

        <p class="hint uk-margin-bottom">
          {{ $t('bookings.components.feeForm.applyHint') }}
        </p>
      </template>

      <template v-if="values.rateType === CALCULATION_TYPES.FLAT_FEE">
        <core-form-input-number
          name="amount"
          class="uk-margin-bottom uk-margin-right amount"
          :label="$t('bookings.components.feeForm.amount')"
          :placeholder="$t('bookings.components.feeForm.amountPlaceholder', {
            sign: currency,
          })"
          rules="required|between:0,1000000000"
          :currency="currency"
          float
        />

        <div class="uk-margin-bottom uk-margin-right charge">
          <label for="chargeType" class="input-label" :class="{ '--invalid': errors.chargeType }">
            {{ $t('bookings.components.feeForm.charge') }}
            <span
              class="question-tooltip"
              uk-icon="icon: question; ratio: 0.5"
              :uk-tooltip="'title:' + $t('bookings.components.feeForm.chargeTooltip')"
            ></span>
          </label>
          <div class="input-container">
            <core-form-select
              id="chargeType"
              name="chargeType"
              :label="$t('bookings.components.feeForm.charge')"
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
            {{ $t('bookings.components.feeForm.frequency') }}
            <span
              class="question-tooltip"
              uk-icon="icon: question; ratio: 0.5"
              :uk-tooltip="'title:' + $t('bookings.components.feeForm.frequencyTooltip')"
            ></span>
          </label>
          <div class="input-container">
            <core-form-select
              id="frequency"
              name="frequency"
              :label="$t('bookings.components.feeForm.frequency')"
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

    <div class="uk-flex uk-flex-bottom uk-flex-wrap">
      <div class="uk-margin-bottom uk-margin-small-right">
        <label
          class="input-label"
          :class="{ '--invalid': errors.taxIncluded }"
          for="taxIncluded"
        >
          {{ $t('bookings.components.feeForm.sales') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="taxIncluded"
            as="select"
            name="taxIncluded"
            class="sales-select"
            :label="$t('bookings.components.feeForm.sales')"
            :class="{ '--invalid': errors.taxIncluded }"
            :data="sales"
            :show-placeholder="false"
            :press-label="false"
            :value="values.taxIncluded || ''"
            @update:modelValue="
              setErrors({ taxValue: null });
              $event === '' && setValues({ ...values, taxValue: null })
            "
          />
          <v-error-message class="input-error-message" name="taxIncluded" />
        </div>
      </div>

      <core-form-input-number
        name="taxValue"
        class="uk-margin-bottom uk-margin-right amount"
        :placeholder="$t('bookings.components.feeForm.percentPlaceholder')"
        :disabled="!values.taxIncluded?.toString().length"
        :rules="'required_if:taxIncluded,1|between_if:taxIncluded,0;1,1,100'"
        suffix="%"
        float
      />
    </div>

    <div class="uk-text-right">
      <button
        type="button"
        class="uk-button uk-button-link uk-margin-right"
        :disabled="loading"
        v-e2e="'cancel-fee'"
        @click="$emit('close')"
      >
        {{ $t('bookings.shared.cancel') }}
      </button>
      <button
        class="uk-button uk-button-primary"
        v-e2e="'create-fee'"
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('bookings.shared.save') }}
      </button>
    </div>
  </v-form>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ErrorMessage, Form } from 'vee-validate';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl } from '@/utils/form';
import { CALCULATION_TYPES, TAX_CHARGE_TYPES, FREQUENCIES } from '@/modules/settings/services/fees';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import CoreFormAutocomplete from '@/modules/core/components/core-form/CoreFormAutocomplete.vue';
import { EXTRAS_TYPES } from '@/modules/bookings/services/extras';

export default {
  name: 'BookingsBookingFeeForm',
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    CoreFormRadioGroup,
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

    const fees = computed(() => store.state.settings.fees.list);
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

    const sales = [
      { label: i18n.t('core.dicts.salesTaxTypes.noVat'), value: '' },
      { label: i18n.t('core.dicts.salesTaxTypes.include'), value: 1 },
      { label: i18n.t('core.dicts.salesTaxTypes.exclude'), value: 0 },
    ];

    const currency = computed(() => {
      if (store.state.bookings.entity?.currency) {
        return store.state.bookings.entity.currency;
      }

      return store.state.account.account?.settings.currency;
    });

    const onSearch = ({ query }) => {
      dict.value = fees.value.filter((fee) => fee.name.toLowerCase().includes(query.toLowerCase()));
    };

    const onSelectFee = (fee) => {
      store.commit('settings/fees/SET_ENTITY', fee);
    };

    const onSubmit = (values) => {
      loading.value = true;
      store.dispatch('bookings/extras/upsert', {
        bookingId: props.bookingId,
        data: { ...values, extrasType: EXTRAS_TYPES.FEE, currency: currency.value },
      })
        .then(() => uikit.notify('success', i18n.t('bookings.components.feeForm.success')))
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
      await store.dispatch('settings/fees/setList');

      if (extra.value) {
        formRef.value.setValues(extra.value);
        onSelectFee(extra.value);
      }
    });

    return {
      formRef,
      CALCULATION_TYPES,
      TAX_CHARGE_TYPES,
      FREQUENCIES,
      calculationItems,
      currency,
      chargeTypes,
      frequencies,
      sales,
      dict,
      loading,

      onSearch,
      onSelectFee,
      onSubmit,
    };
  },
};
</script>
