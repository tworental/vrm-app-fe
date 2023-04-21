<template>
  <v-form
    name="global-settings"
    v-e2e
    v-slot="{ errors }"
    @submit="onSubmit"
  >
    <div class="grid uk-margin-bottom">
      <div>
        <label class="input-label" :class="{ '--invalid': errors.language }" for="language">
          {{ $t('organization.shared.uiLanguage') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="language"
            name="language"
            :class="{ '--invalid': errors.language }"
            :label="$t('organization.shared.uiLanguage')"
            rules="required"
            :value="settings.language"
            :data="languages"
          />
          <v-error-message class="input-error-message" name="uiLanguage" />
        </div>
      </div>
      <div>
        <label class="input-label" :class="{ '--invalid': errors.timezone }" for="timezone">
          {{ $t('organization.shared.timezone') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="timezone"
            name="timezone"
            :label="$t('organization.shared.timezone')"
            :class="{ '--invalid': errors.timezone }"
            rules="required"
            :value="settings.timezone"
            :data="timeZones"
            :press-label="false"
          />
          <v-error-message class="input-error-message" name="timezone" />
        </div>
      </div>
      <div class="currency-select">
        <label class="input-label" :class="{ '--invalid': errors.currency }" for="currency">
          {{ $t('organization.shared.currency') }}
          <span
            class="question-tooltip"
            uk-icon="icon: question; ratio: 0.5"
            :uk-tooltip="'title:' + $t('organization.shared.currencyTooltip')"
          ></span>
        </label>
        <div class="input-container">
          <core-form-select
            id="currency"
            name="currency"
            :label="$t('organization.shared.currency')"
            :class="{ '--invalid': errors.currency }"
            rules="required"
            :value="settings.currency"
            :data="currencies"
            :press-label="false"
            :search="true"
            :show-placeholder="false"
          />
          <v-error-message class="input-error-message" name="currency" />
        </div>
      </div>
    </div>

    <div class="grid">
      <div>
        <label class="input-label" :class="{ '--invalid': errors.dateFormat }" for="dateFormat">
          {{ $t('organization.shared.dateFormat') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="dateFormat"
            name="dateFormat"
            :label="$t('organization.shared.dateFormat')"
            :class="{ '--invalid': errors.dateFormat }"
            :value="settings.dateFormat || DATE_FORMATS.auto"
            :data="dateFormats"
            :press-label="false"
            :show-placeholder="false"
          />
          <v-error-message class="input-error-message" name="dateFormat" />
        </div>
      </div>
      <div>
        <label class="input-label" :class="{ '--invalid': errors.measuringUnits }" for="measuringUnits">
          {{ $t('organization.shared.measuringUnits') }}
        </label>
        <div class="input-container">
          <core-form-radio-group
            id="measuringUnits"
            name="measuringUnits"
            :label="$t('organization.shared.measuringUnits')"
            :class="{ '--invalid': errors.measuringUnits }"
            rules="required"
            :value="settings.measuringUnits"
            :items="measuringItems"
          />
          <v-error-message class="input-error-message" name="measuringUnits" />
        </div>
      </div>
    </div>

    <div class="uk-text-right" v-can:account.write="user">
      <button
        type="submit"
        class="uk-button uk-button-success"
        :disabled="loading"
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
import { useI18n } from 'vue-i18n';
import { ErrorMessage, Form } from 'vee-validate';
import timezones from 'compact-timezone-list';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl } from '@/utils/form';
import { DATE_FORMATS, MEASURING_UNITS } from '@/modules/account/services';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';

export default {
  name: 'OrganizationGlobalSettings',
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    CoreFormRadioGroup,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);
    const settings = computed(() => store.state.account.account.settings);

    const languages = computed(() => store.getters['core/languages'].map((lang) => ({
      label: i18n.t(`organization.dicts.languages.${lang}`),
      value: lang,
    })));

    const currencies = computed(() => store.getters['core/currencies']);

    const timeZones = timezones.map((tz) => ({
      label: `(GMT${tz.offset}) ${tz.tzCode.replace('_', '')}`,
      value: tz.tzCode,
    }));

    const measuringItems = Object.values(MEASURING_UNITS).map((unit) => ({
      label: i18n.t(`organization.dicts.measuringUnits.${unit}`),
      value: unit,
    }));

    const dateFormats = Object.values(DATE_FORMATS).map((dateFormat) => ({
      label: dateFormat || i18n.t('organization.dicts.dateFormats.auto'),
      value: dateFormat,
    }));

    const onSubmit = (values, { setErrors }) => {
      loading.value = true;

      return store.dispatch('account/updateAccount', values)
        .then(() => uikit.notify('success', i18n.t('organization.components.globalSettings.successUpdate')))
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
      DATE_FORMATS,
      loading,
      settings,
      languages,
      currencies,
      timeZones,
      measuringItems,
      dateFormats,
      user,

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

  @include fromTablet {
    grid-template-columns: 2fr 2fr 1fr;
  }
}
</style>
