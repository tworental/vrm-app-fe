<template>
  <v-form
    name="company-settings"
    v-e2e
    v-slot="{ errors }"
    @submit="onSubmit"
  >
    <div class="uk-margin-bottom">
      <label
        class="input-label"
        :class="{ '--invalid': errors.companyName }"
        for="companyName"
      >
        {{ $t('organization.shared.name') }}
      </label>
      <div class="input-container">
        <v-field
          id="companyName"
          class="uk-input --outline"
          name="companyName"
          type="text"
          :label="$t('organization.shared.name')"
          :class="{ '--invalid': errors.companyName }"
          rules="required"
          :value="account.companyName"
          v-e2e
        />

        <v-error-message class="input-error-message" name="companyName" />
      </div>
    </div>

    <div class="grid uk-margin-bottom">
      <div>
        <label
          class="input-label"
          :class="{ '--invalid': errors.companyAddress }"
          for="companyAddress"
        >
          {{ $t('organization.shared.companyAddress') }}
        </label>
        <div class="input-container">
          <v-field
            id="companyAddress"
            class="uk-input --outline"
            name="companyAddress"
            type="text"
            :label="$t('organization.shared.companyAddress')"
            :class="{ '--invalid': errors.companyAddress }"
            rules="required"
            :value="account.companyAddress"
            v-e2e
          />

          <v-error-message class="input-error-message" name="companyAddress" />
        </div>
      </div>
      <div>
        <label
          class="input-label"
          :class="{ '--invalid': errors.companyCity }"
          for="companyAddress"
        >
          {{ $t('organization.shared.companyCity') }}
        </label>
        <div class="input-container">
          <v-field
            id="companyCity"
            class="uk-input --outline"
            name="companyCity"
            type="text"
            :label="$t('organization.shared.companyCity')"
            :class="{ '--invalid': errors.companyCity }"
            rules="required"
            :value="account.companyCity"
            v-e2e
          />

          <v-error-message class="input-error-message" name="companyCity" />
        </div>
      </div>
    </div>

    <div class="grid uk-margin-bottom">
      <div>
        <label
          class="input-label"
          :class="{ '--invalid': errors.companyZip }"
          for="companyZip"
        >
          {{ $t('organization.shared.companyZip') }}
        </label>
        <div class="input-container">
          <v-field
            id="companyZip"
            class="uk-input --outline"
            name="companyZip"
            type="text"
            :label="$t('organization.shared.companyZip')"
            :class="{ '--invalid': errors.companyZip }"
            rules="required"
            :value="account.companyZip"
            v-e2e
          />

          <v-error-message class="input-error-message" name="companyZip" />
        </div>
      </div>

      <div>
        <label class="input-label" :class="{ '--invalid': errors.companyCountry }" for="companyCountry">
          {{ $t('organization.shared.companyCountry') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="companyCountry"
            name="companyCountry"
            :class="{ '--invalid': errors.companyCountry }"
            :label="$t('organization.shared.companyCountry')"
            :value="account.companyCountry"
            rules="required"
            :data="countries"
            :search="true"
          />
          <v-error-message class="input-error-message" name="companyCountry" />
        </div>
      </div>
    </div>

    <div class="grid uk-margin-bottom">
      <div>
        <label
          class="input-label"
          :class="{ '--invalid': errors.companyVatId }"
          for="companyVatId"
        >
          {{ $t('organization.shared.companyVatId') }}
        </label>
        <div class="input-container">
          <v-field
            id="companyVatId"
            class="uk-input --outline"
            name="companyVatId"
            type="text"
            :label="$t('organization.shared.companyVatId')"
            :class="{ '--invalid': errors.companyVatId }"
            rules="check_regex:vatId"
            :value="account.companyVatId"
            v-e2e
          />

          <v-error-message class="input-error-message" name="companyVatId" />
        </div>
      </div>
    </div>

    <div class="uk-text-right">
      <button
        type="submit"
        class="uk-button uk-button-success"
        :disabled="loading"
        v-can:account.write="user"
        v-e2e
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('organization.shared.btn.save') }}
      </button>
    </div>
  </v-form>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import COUNTRIES from 'country-region-data';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import { scrollToFirstInvalidControl } from '@/utils/form';

export default {
  name: 'OrganizationCompanyData',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);

    const account = computed(() => store.state.account.account);
    const user = computed(() => store.state.account.user);

    const countries = COUNTRIES.map((country) => ({
      label: country.countryName,
      value: country.countryShortCode,
    }));

    const onSubmit = (values, { setErrors }) => {
      loading.value = true;

      return store.dispatch('account/updateAccount', values)
        .then(() => uikit.notify('success', i18n.t('organization.components.companySettings.successUpdate')))
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
    };

    return {
      loading,
      account,
      user,
      countries,

      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-gap: 20px;

  @include fromWideMobile {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
