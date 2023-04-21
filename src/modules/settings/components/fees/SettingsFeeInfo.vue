<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cash-network.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ title }}</h5>
        </div>
        <p class="card__description">
          {{ $t('settings.components.feeInfo.description') }}
        </p>
      </div>
    </div>

    <div>
      <div class="grid">
        <div class="uk-margin-bottom">
          <label
            class="input-label"
            :class="{ '--invalid': errors.name }"
            for="name"
          >
            {{ $t('settings.components.feeInfo.name') }}
          </label>
          <div class="input-container">
            <v-field
              id="name"
              class="uk-input --outline"
              name="name"
              type="text"
              :label="$t('settings.components.feeInfo.name')"
              :class="{ '--invalid': errors.name }"
              :value="fee?.name"
              rules="required|min:2|max:191"
              v-e2e
            />
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>
      </div>
      <div class="input-container uk-margin-bottom">
        <v-field
          id="description"
          class="uk-textarea --outline"
          name="description"
          as="textarea"
          rows="8"
          :label="$t('settings.components.feeInfo.descriptionField')"
          :placeholder="$t('settings.components.feeInfo.descriptionField')"
          :class="{ '--invalid': errors.description }"
          :value="fee?.description"
          v-e2e
        />
        <v-error-message class="input-error-message" name="description" />
      </div>
    </div>

    <div class="card__header calculation">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cash-settings.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.components.feeInfo.calculationModel') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('settings.components.feeInfo.calculationModelDescription') }}
        </p>
      </div>
    </div>

    <div class="uk-margin-bottom">
      <core-form-radio-group
        name="rateType"
        :items="calculationItems"
        :value="fee?.rateType || CALCULATION_TYPES.FLAT_FEE"
        v-e2e="'rateType'"
      />
    </div>

    <div class="uk-flex uk-flex-middle uk-flex-wrap">
      <template v-if="values.rateType === CALCULATION_TYPES.PERCENTAGE">
        <core-form-input-number
          class="uk-margin-bottom uk-margin-small-right"
          :label="$t('settings.components.feeInfo.percentage')"
          name="percentage"
          :placeholder="$t('settings.components.feeInfo.percentPlaceholder')"
          rules="required|between:0,100"
          :value="fee?.percentage"
          :min="0"
          :max="100"
          suffix="%"
        />

        <p class="hint uk-margin-bottom">
          {{ $t('settings.components.feeInfo.applyHint') }}
        </p>
      </template>

      <template v-if="values.rateType === CALCULATION_TYPES.FLAT_FEE">
        <div class="uk-margin-bottom uk-margin-right currency-select">
          <label for="currency" class="input-label" :class="{ '--invalid': errors.currency }">
            {{ $t('settings.components.feeInfo.currency') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="currency"
              name="currency"
              :label="$t('settings.components.feeInfo.currency')"
              :class="{ '--invalid': errors.currency }"
              :value="fee?.currency || defaultCurrency"
              rules="required"
              :data="currencies"
              :press-label="false"
              :search="true"
              :show-placeholder="false"
            />
            <v-error-message class="input-error-message" name="currency" />
          </div>
        </div>

        <core-form-input-number
          name="amount"
          class="uk-margin-bottom uk-margin-right amount"
          :label="$t('settings.components.feeInfo.amount')"
          :placeholder="$t('settings.components.feeInfo.amountPlaceholder', {
            sign: values.currency,
          })"
          :value="fee?.amount"
          rules="required|between:0,1000000000"
          :currency="values.currency"
          float
        />

        <div class="uk-margin-bottom uk-margin-right charge">
          <label for="chargeType" class="input-label" :class="{ '--invalid': errors.chargeType }">
            {{ $t('settings.components.feeInfo.charge') }}
            <span
              class="question-tooltip"
              uk-icon="icon: question; ratio: 0.5"
              :uk-tooltip="'title:' + $t('settings.components.feeInfo.chargeTooltip')"
            ></span>
          </label>
          <div class="input-container">
            <core-form-select
              id="chargeType"
              name="chargeType"
              :label="$t('settings.components.feeInfo.charge')"
              :class="{ '--invalid': errors.chargeType }"
              :value="fee?.chargeType || TAX_CHARGE_TYPES.SINGLE_CHARGE"
              rules="required"
              :data="chargeTypes"
              :show-placeholder="false"
            />
            <v-error-message class="input-error-message" name="chargeType" />
          </div>
        </div>
        <div class="uk-margin-bottom uk-margin-right charge">
          <label for="frequency" class="input-label" :class="{ '--invalid': errors.frequency }">
            {{ $t('settings.components.feeInfo.frequency') }}
            <span
              class="question-tooltip"
              uk-icon="icon: question; ratio: 0.5"
              :uk-tooltip="'title:' + $t('settings.components.feeInfo.frequencyTooltip')"
            ></span>
          </label>
          <div class="input-container">
            <core-form-select
              id="frequency"
              name="frequency"
              :label="$t('settings.components.feeInfo.frequency')"
              :class="{ '--invalid': errors.frequency }"
              :value="fee?.frequency || FREQUENCIES.PER_STAY"
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
          {{ $t('settings.components.feeInfo.sales') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="taxIncluded"
            as="select"
            name="taxIncluded"
            class="sales-select"
            :label="$t('settings.components.feeInfo.sales')"
            :class="{ '--invalid': errors.taxIncluded }"
            :value="fee?.taxIncluded === null ? '' : (fee?.taxIncluded === undefined ? '' : fee?.taxIncluded)"
            :data="sales"
            :show-placeholder="false"
            :press-label="false"
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
        :placeholder="$t('settings.components.feeInfo.percentPlaceholder')"
        :disabled="!values.taxIncluded?.toString().length"
        :rules="'required_if:taxIncluded,1|between_if:taxIncluded,0;1,1,100'"
        :value="fee?.taxValue"
        suffix="%"
        float
      />
    </div>

    <div class="uk-text-right">
      <button
        type="submit"
        class="uk-button uk-button-success uk-padding uk-padding-remove-vertical"
        :disabled="loading"
        v-e2e="'fee'"
        @click="handleSubmitClick({ validate, onSubmit })"
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('settings.shared.save') }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { showModalForDirtyForm } from '@/utils/modal';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

import { CALCULATION_TYPES, TAX_CHARGE_TYPES, FREQUENCIES } from '../../services/fees';

export default {
  name: 'SettingsFeeInfo',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormRadioGroup,
    CoreFormSelect,
    CoreFormInputNumber,
  },
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const router = useRouter();
    const { formErrorFormatter } = useApiFormatters();

    const {
      values: formValues,
      errors: formErrors,
      meta,
      handleSubmit,
      setErrors,
      setValues,
      validate,
      resetForm,
    } = useForm();

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

    const loading = ref(false);

    const currencies = computed(() => store.getters['core/currencies']);
    const fee = computed(() => store.state.settings.fees.entity);
    const defaultCurrency = computed(() => store.state.account.account?.settings.currency);

    const onSubmit = handleSubmit(async (values) => {
      loading.value = true;
      const payload = { ...values };

      // TODO: should be replaced with "exclude properties obj" function
      if (values.rateType === CALCULATION_TYPES.FLAT_FEE) {
        delete payload.percentage;
      } else if (values.rateType === CALCULATION_TYPES.PERCENTAGE) {
        delete payload.currency;
        delete payload.amount;
        payload.chargeType = TAX_CHARGE_TYPES.SINGLE_CHARGE;
        payload.frequency = FREQUENCIES.PER_STAY;
      }

      try {
        await store.dispatch('settings/fees/upsert', payload);

        resetForm({ values: formValues, dirty: false });

        await router.push({ name: 'settings-fees' });

        uikit.notify('success', i18n.t('settings.components.feeInfo.saveSuccess'));
      } catch (err) {
        const errors = formErrorFormatter(err);

        if (Object.keys(errors).length) {
          setErrors(errors);
          scrollToFirstInvalidControl();
        } else {
          uikit.notify('danger', err.message);
        }
      } finally {
        loading.value = false;
      }
    });

    onBeforeRouteLeave(showModalForDirtyForm({
      uikit,
      i18n,
      meta,
    }));

    return {
      CALCULATION_TYPES,
      TAX_CHARGE_TYPES,
      FREQUENCIES,
      calculationItems,
      fee,
      currencies,
      loading,
      defaultCurrency,
      chargeTypes,
      frequencies,
      sales,
      values: formValues,
      errors: formErrors,

      onSubmit,
      handleSubmitClick,
      setErrors,
      setValues,
      validate,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;
  padding: 20px;

  &__header {
    margin-bottom: 24px;
  }

  &__heading {
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 700;
    color: $base-color-darken;
    margin: 0;
  }

  &__description {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    margin: 0;
  }
}
.grid {
  display: grid;
  grid-gap: 20px;

  @include fromWideMobile {
    grid-template-columns: 1fr 1fr;
  }

  @include mediaFrom(1250px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
.hint {
  font-size: 0.875rem;
  color: rgba($base-color-darken, 0.7);
  max-width: 293px;
  font-style: italic;
  line-height: 40px;
  height: 40px;
}
.charge {
  min-width: 200px;
}
.calculation {
  padding-top: 20px;
}
.amount {
  max-width: 100px;
  width: 100%;
}
</style>
