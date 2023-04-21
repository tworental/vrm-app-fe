<template>
  <div
    class="card"
  >
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cog-hand.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.components.serviceInfo.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('settings.components.serviceInfo.description') }}
        </p>
      </div>
    </div>

    <div>
      <div class="grid uk-margin-bottom">
        <div>
          <label
            class="input-label --required"
            :class="{ '--invalid': errors.name }"
            for="name"
          >
            {{ $t('settings.components.serviceInfo.name') }}
          </label>
          <div class="input-container">
            <v-field
              id="name"
              class="uk-input --outline"
              name="name"
              type="text"
              :placeholder="$t('settings.components.serviceInfo.name')"
              :label="$t('settings.components.serviceInfo.name')"
              :class="{ '--invalid': errors.name }"
              rules="required"
              :value="service.name"
              :disabled="!canWrite"
              v-e2e
            />
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>
        <div class="uk-flex uk-flex-middle">
          <div class="uk-margin-right duration-enabled">
            <div class="input-container">
              <core-form-checkbox
                name="durationEnabled"
                :label="$t('settings.components.serviceInfo.durationEnabled')"
                :checked="!!service.duration"
                :disabled="!canWrite"
              />
            </div>
          </div>
          <div class="duration-select">
            <settings-service-duration-input
              class="uk-text-nowrap"
              :label="$t('settings.components.serviceInfo.duration')"
              name="duration"
              :placeholder="$t('settings.components.serviceInfo.duration')"
              :disabled="!canWrite || !values.durationEnabled"
              :value="getHHMMFromMinutes(service.duration)"
              :errors="errors"
            />
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
          :label="$t('settings.components.serviceInfo.descriptionField')"
          :placeholder="$t('settings.components.serviceInfo.descriptionField')"
          :class="{ '--invalid': errors.description }"
          :value="service.description"
          :disabled="!canWrite"
          v-e2e
        />
        <v-error-message class="input-error-message" name="description" />
      </div>

      <div class="uk-margin-bottom provider">
        <div>
          <label
            class="input-label"
            :class="{ '--invalid': errors.serviceProviderId }"
            for="provider"
          >
            {{ $t('settings.components.serviceInfo.provider') }}
          </label>
          <div class="input-container" :class="{ 'uk-margin-bottom': errors.serviceProviderId }">
            <core-form-select
              id="provider"
              name="serviceProviderId"
              :label="$t('settings.components.serviceInfo.provider')"
              :class="{ '--invalid': errors.serviceProviderId }"
              :data="serviceProviders"
              :value="values.serviceProviderId"
              :disabled="!canWrite || serviceProviders.length === 0"
            />
            <v-error-message class="input-error-message" name="serviceProviderId" />
          </div>
          <div class="meta-info" v-if="canWrite">
            {{ $t('settings.components.serviceInfo.noProviders') }} -
            <a @click.prevent="onCreateProvider">
              {{ $t('settings.components.serviceInfo.createProvider') }}
            </a>
          </div>
        </div>
      </div>

      <div class="uk-margin-bottom">
        <label class="input-label --required">{{ $t('settings.components.serviceInfo.timing') }}</label>
        <div class="input-container">
          <core-form-radio-group
            name="type"
            :items="timingItems"
            :value="service.type || TIMING_TYPES.EXACT_TIME"
            rules="required"
            v-e2e="'type'"
            :disabled="!canWrite"
          />
          <v-error-message class="input-error-message uk-text-nowrap" name="type" />
        </div>
      </div>
    </div>

    <div class="card__header calculation">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cash-settings.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.components.serviceInfo.calculationModel') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('settings.components.serviceInfo.calculationModelDescription') }}
        </p>
      </div>
    </div>

    <div class="uk-flex uk-flex-middle uk-flex-wrap">
      <div class="uk-margin-bottom uk-margin-right currency-select">
        <label for="currency" class="input-label --required" :class="{ '--invalid': errors.currency }">
          {{ $t('settings.components.serviceInfo.currency') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="currency"
            name="currency"
            :label="$t('settings.components.serviceInfo.currency')"
            :class="{ '--invalid': errors.currency }"
            :value="service.currency || defaultCurrency"
            rules="required"
            :data="currencies"
            :press-label="false"
            :search="true"
            :disabled="!canWrite"
            :show-placeholder="false"
          />
          <v-error-message class="input-error-message" name="currency" />
        </div>
      </div>
      <core-form-input-number
        class="uk-margin-bottom uk-margin-right"
        name="amount"
        :label="$t('settings.components.serviceInfo.amount')"
        :placeholder="$t('settings.components.serviceInfo.amountPlaceholder', {
              sign: values.currency || defaultCurrency
            })"
        rules="required|between:0,1000000000"
        :value="service.amount"
        :currency="service.currency || defaultCurrency"
        :disabled="!canWrite"
        float
      />
      <div class="uk-margin-bottom uk-margin-right charge">
        <label for="chargeType" class="input-label" :class="{ '--invalid': errors.chargeType }">
          {{ $t('settings.components.serviceInfo.charge') }}
          <span
            class="question-tooltip"
            uk-icon="icon: question; ratio: 0.5"
            :uk-tooltip="'title:' + $t('settings.components.serviceInfo.chargeTooltip')"
          ></span>
        </label>
        <div class="input-container">
          <core-form-select
            id="chargeType"
            name="chargeType"
            :label="$t('settings.components.serviceInfo.charge')"
            :class="{ '--invalid': errors.chargeType }"
            rules="required"
            :value="service.chargeType || CHARGE_TYPES.PER_NIGHT"
            :data="chargeTypes"
            :disabled="!canWrite"
            :show-placeholder="false"
          />
          <v-error-message class="input-error-message" name="chargeType" />
        </div>
      </div>
    </div>

    <div class="uk-flex uk-flex-bottom uk-flex-wrap">
      <div class="uk-margin-bottom uk-margin-small-right">
        <label
          class="input-label"
          :class="{ '--invalid': errors.taxIncluded }"
          for="taxIncluded"
        >
          {{ $t('settings.components.serviceInfo.sales') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="taxIncluded"
            as="select"
            name="taxIncluded"
            class="sales-select"
            :label="$t('settings.components.serviceInfo.sales')"
            :class="{ '--invalid': errors.taxIncluded }"
            :value="service?.taxIncluded === null ? '' : service?.taxIncluded"
            :data="sales"
            :show-placeholder="false"
            :press-label="false"
            :disabled="!canWrite"
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
        :placeholder="$t('settings.components.serviceInfo.percentPlaceholder')"
        :disabled="!values.taxIncluded?.toString().length"
        :rules="'required_if:taxIncluded,1|between_if:taxIncluded,0;1,1,100'"
        :value="service.taxValue"
        :readonly="!canWrite"
        suffix="%"
        float
      />
    </div>

    <div class="uk-text-right">
      <button
        type="button"
        class="uk-button uk-button-link uk-margin-right"
        v-e2e="'cancel'"
        @click="$router.push({ name: 'settings-services' })"
      >
        {{ $t('settings.shared.cancel') }}
      </button>
      <button
        class="uk-button uk-button-success uk-padding uk-padding-remove-vertical"
        :disabled="!canWrite || loading"
        v-e2e="'save'"
        :uk-tooltip="!canWrite ? 'title: ' + $t('settings.components.serviceInfo.saveDisabled') : ''"
        @click="handleSubmitClick({ validate, onSubmit })"
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('settings.shared.save') }}
      </button>
    </div>
    <core-drawer ref="drawerRef" :loading="drawerLoading">
      <settings-service-provider-form
        ref="providerFormRef"
        :redirect="false"
        @save="onSaveProvider"
      />
    </core-drawer>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { ErrorMessage, Field, useForm } from 'vee-validate';

import { ABILITIES, can, MODULES } from '@/utils/acl';
import { showModalForDirtyForm } from '@/utils/modal';
import { getHHMMFromMinutes, getMinutesFromHHMM } from '@/utils/datetime';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { handleSubmitClick, scrollToFirstInvalidControl } from '@/utils/form';
import { TIMING_TYPES } from '@/modules/settings/services/services';
import { CHARGE_TYPES } from '@/modules/settings/services/fees';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import SettingsServiceProviderForm from '@/modules/settings/views/services/SettingsServiceProviderForm.vue';
import SettingsServiceDurationInput from '@/modules/settings/components/services/SettingsServiceDurationInput.vue';

export default {
  name: 'SettingsServiceInfo',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawer,
    CoreFormRadioGroup,
    CoreFormSelect,
    CoreFormCheckbox,
    CoreFormInputNumber,
    SettingsServiceProviderForm,
    SettingsServiceDurationInput,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const router = useRouter();
    const { formErrorFormatter } = useApiFormatters();

    const service = computed(() => store.state.settings.services.entity);

    const {
      values: formValues,
      errors: formErrors,
      meta,
      handleSubmit,
      setValues,
      setFieldValue,
      setErrors,
      validate,
      resetForm,
    } = useForm({
      initialValues: {
        serviceProviderId: service.value.serviceProviderId,
      },
    });

    const sales = [
      { label: i18n.t('core.dicts.salesTaxTypes.noVat'), value: '' },
      { label: i18n.t('core.dicts.salesTaxTypes.include'), value: 1 },
      { label: i18n.t('core.dicts.salesTaxTypes.exclude'), value: 0 },
    ];

    const timingItems = Object.values(TIMING_TYPES).map((key) => ({
      label: i18n.t(`settings.dicts.timing.${key}`),
      value: key,
    }));

    const chargeTypes = Object.values(CHARGE_TYPES).map((key) => ({
      label: i18n.t(`settings.dicts.chargeTypes.${key}`),
      value: key,
    }));

    const drawerRef = ref(null);
    const providerFormRef = ref(null);
    const loading = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const canWrite = computed(() => can(loggedUser.value, MODULES.SERVICES, [ABILITIES.WRITE]));

    const drawerLoading = computed(() => store.state.settings.serviceProviders.formLoading);

    const currencies = computed(() => store.getters['core/currencies']);

    const defaultCurrency = computed(() => store.state.account.account?.settings.currency);

    const serviceProviders = computed(() => store.state.settings.serviceProviders.list.map((provider) => ({
      label: provider.name,
      value: provider.id,
    })));

    const onCreateProvider = () => uikit.drawer.toggle(drawerRef.value.$el, true);
    const onSaveProvider = () => {
      const lastEl = store.state.settings.serviceProviders.list.length - 1;

      uikit.drawer.toggle(drawerRef.value.$el, false);
      setFieldValue('serviceProviderId', store.state.settings.serviceProviders.list[lastEl].id);
    };

    const onSubmit = handleSubmit((values) => {
      loading.value = true;
      const payload = {
        ...values,
        serviceProviderId: values.serviceProviderId || '',
      };

      return store.dispatch('settings/services/update', {
        id: service.value.id,
        ...payload,
        duration: payload.duration ? getMinutesFromHHMM(payload.duration) : null,
      })
        .then(() => uikit.notify('success', i18n.t('settings.components.serviceInfo.successUpdate')))
        .then(() => resetForm({ values: formValues, dirty: false }))
        .then(() => router.push({ name: 'settings-services' }))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => { loading.value = false; });
    });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        providerFormRef.value.formRef.resetForm();
      });
    });

    onBeforeRouteLeave(showModalForDirtyForm({
      uikit,
      i18n,
      meta,
    }));

    return {
      canWrite,
      TIMING_TYPES,
      CHARGE_TYPES,
      drawerRef,
      providerFormRef,
      sales,
      timingItems,
      chargeTypes,
      serviceProviders,
      currencies,
      defaultCurrency,
      drawerLoading,
      service,
      loading,
      errors: formErrors,
      values: formValues,

      onCreateProvider,
      onSaveProvider,
      onSubmit,
      handleSubmitClick,
      validate,
      setValues,
      setErrors,
      getHHMMFromMinutes,
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

  @include fromTablet {
    grid-template-columns: 1fr 2fr;
  }
}
.duration-select {
  min-width: 120px;
}
.amount {
  max-width: 80px;
  width: 100%;
}
.calculation-type {
  max-width: 250px;
  width: 100%;
}
.duration-enabled {
  height: 42px;
  display: flex;
  align-items: center;
  align-self: flex-end;
}
.sales-select {
  width: 260px;
}
.calculation {
  padding-top: 20px;
}
.meta-info {
  margin-top: 4px;
  &,
  a {
    font-size: 0.75rem;
  }
}
.--currency {
  max-width: 140px;
}
.provider {
  @include fromTablet {
    width: 50%;
    min-width: 370px;
    max-width: 400px;
  }
}
</style>
