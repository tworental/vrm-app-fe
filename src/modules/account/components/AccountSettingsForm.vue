<template>
  <v-form
    name="settings"
    v-slot="{ errors, validate }"
    @submit="onSubmit"
    class="uk-position-relative"
    v-e2e
  >
    <div class="half-grid">
      <div class="uk-margin-bottom">
        <label class="input-label --required" :class="{ '--invalid': errors.language }" for="language">
          {{ $t('account.shared.uiLanguage') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="language"
            name="language"
            :class="{ '--invalid': errors.language }"
            :label="$t('account.shared.uiLanguage')"
            rules="required"
            :value="user?.language"
            :data="languages"
            :show-placeholder="false"
          />
          <v-error-message class="input-error-message" name="uiLanguage" />
        </div>
      </div>
      <div class="uk-margin-bottom">
        <label class="input-label --required" :class="{ '--invalid': errors.timezone }" for="timezone">
          {{ $t('account.shared.timezone') }}
        </label>
        <div class="input-container">
          <core-form-select
            id="timezone"
            name="timezone"
            :label="$t('account.shared.timezone')"
            :class="{ '--invalid': errors.timezone }"
            rules="required"
            :value="user?.timezone"
            :data="timeZones"
            :show-placeholder="false"
          />
          <v-error-message class="input-error-message" name="timezone" />
        </div>
      </div>
    </div>
    <div class="uk-text-right">
      <button
        class="uk-button uk-button-success"
        type="submit"
        :disabled="loading || Object.keys(errors).length"
        v-e2e
        @click="handleSubmitClick({ validate })"
      >{{ $t('account.shared.btn.save') }}</button>
    </div>

    <div v-if="loading" class="uk-overlay-default uk-position-cover">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </v-form>
</template>

<script>
import { Form, ErrorMessage } from 'vee-validate';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import timezones from 'compact-timezone-list';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';

export default {
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);
    const languages = computed(() => store.getters['core/languages'].map((lang) => ({
      label: i18n.t(`account.dicts.languages.${lang}`),
      value: lang,
    })));

    const timeZones = timezones.map((tz) => ({
      label: `(GMT${tz.offset}) ${tz.tzCode.replace('_', '')}`,
      value: tz.tzCode,
    }));

    const onSubmit = (values, { setErrors }) => {
      loading.value = true;

      return store.dispatch('account/updateUser', values)
        .then(() => uikit.notify('success', i18n.t('account.components.settings.successUpdate')))
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
      user,
      languages,
      timeZones,
      onSubmit,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.half-grid {
  display: grid;

  @include fromWideMobile {
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
