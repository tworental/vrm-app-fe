<template>
  <v-form
    name="change-password"
    ref="form"
    v-slot="{ errors, validate }"
    @submit="onSubmit"
    class="uk-position-relative"
    v-e2e
  >
    <div class="half-grid">
      <div class="uk-margin-bottom">
        <label class="input-label --required" :class="{ '--invalid': errors.password }" for="password">
          {{ $t('account.shared.newPassword') }}
        </label>
        <div class="input-container">
          <v-field
            id="password"
            class="uk-input --outline"
            as="input"
            type="password"
            name="password"
            :label="$t('account.shared.newPassword')"
            :class="{ '--invalid': errors.password }"
            rules="required|min:8"
            v-e2e
          >
          </v-field>
          <v-error-message class="input-error-message" name="password" />
        </div>
      </div>

      <div class="uk-margin-bottom">
        <label
          class="input-label --required"
          :class="{ '--invalid': errors.repeatNewPassword }"
          for="repeatNewPassword"
        >
          {{ $t('account.shared.repeatNewPassword') }}
        </label>
        <div class="input-container">
          <v-field
            id="repeatNewPassword"
            class="uk-input --outline"
            as="input"
            type="password"
            name="repeatNewPassword"
            :label="$t('account.shared.repeatNewPassword')"
            :class="{ '--invalid': errors.repeatNewPassword }"
            rules="required|min:8|confirmed:@password"
            v-e2e
          >
          </v-field>
          <v-error-message class="input-error-message" name="repeatNewPassword" />
        </div>
      </div>
    </div>
    <div class="uk-text-right">
      <button
        class="uk-button uk-button-success"
        type="submit"
        :disabled="loading || Object.keys(errors).length"
        @click="handleSubmitClick({ validate })"
        v-e2e
      >{{ $t('account.shared.btn.changePassword') }}</button>
    </div>
    <div v-if="loading" class="uk-overlay-default uk-position-cover">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </v-form>
</template>

<script>
import { ref } from 'vue';
import {
  Form,
  Field,
  ErrorMessage,
} from 'vee-validate';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const form = ref(null);
    const loading = ref(false);

    const onSubmit = ({ password }, { setErrors }) => {
      loading.value = true;

      return store.dispatch('account/updateUser', { password })
        .then(() => form.value.resetForm())
        .then(() => uikit.notify('success', i18n.t('account.components.changePassword.successUpdate')))
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
      form,
      loading,
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
