<template>
  <auth-forgot-thank-you v-if="isSuccess" />
  <div class="auth-container uk-container" v-else>
    <div class="auth__content">
      <div>
        <router-link class="auth__logo" to="/" v-e2e="'logo'">
          <core-svg width="32" class="logo --no-stroke" :src="require('@/assets/images/logo.svg')" />
          <span class="auth__logo-text --from-tablet">{{ $t('auth.shared.logo') }}</span>
        </router-link>
        <h2 class="auth__title">{{ $t('auth.views.forgotPassword.title') }}</h2>
        <p class="auth__hint">{{ $t('auth.views.forgotPassword.hint') }}</p>
      </div>

      <div class="--to-tablet">
        <core-svg class="auth__bg-icon --no-stroke" :src="require('@/assets/images/auth/gray-bg.svg')" />
        <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/forgot-password.svg')" />
      </div>

      <v-form
        class="auth__form"
        name="forgot-password"
        @submit="onSubmit"
        v-slot="{ isSubmitting, validate }"
        v-e2e
      >
        <div class="auth__form-control --big-space">
          <label class="auth__label" for="email">{{ $t('auth.shared.email') }}</label>
          <div class="input-container --with-icon">
            <core-svg class="input-icon --prefix" width="20" :src="require('@/assets/images/icons/envelope.svg')" />
            <v-field
              id="email"
              class="uk-input"
              name="email"
              as="input"
              type="email"
              :placeholder="$t('auth.shared.email')"
              rules="required|email"
              v-e2e
            />
            <v-error-message class="input-error-message" name="email" />
          </div>
        </div>

        <button
          class="uk-button uk-button-primary auth__btn"
          :disabled="isSubmitting"
          @click="handleSubmitClick({ validate })"
          v-e2e
        >
          {{ $t('auth.views.forgotPassword.send') }}
        </button>

        <div class="uk-text-center uk-margin-top">
          <router-link :to="{ name: 'signin' }" v-e2e="'signin'">{{ $t('auth.shared.backToLogin') }}</router-link>
        </div>
      </v-form>
    </div>
    <div class="auth__figure --from-tablet">
      <core-svg
        class="auth__login-bg-desktop --no-stroke"
        :src="require('@/assets/images/auth/gray-bg-desktop.svg')"
      />
      <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/forgot-password.svg')" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import AuthForgotThankYou from '../components/AuthForgotThankYou.vue';
import { resetPasswordRequest } from '../services';

export default {
  components: {
    'v-form': Form,
    'v-field': Field,
    'v-error-message': ErrorMessage,
    AuthForgotThankYou,
  },
  setup() {
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const isSuccess = ref(false);

    const onSubmit = async (values, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      try {
        await resetPasswordRequest(values);

        isSuccess.value = true;
      } catch (err) {
        const errors = formErrorFormatter(err);

        if (Object.keys(errors).length) {
          setErrors(errors);
          scrollToFirstInvalidControl();
        } else {
          uikit.notify('danger', err.message);
        }
      }
    };

    return { onSubmit, isSuccess, handleSubmitClick };
  },
};
</script>
