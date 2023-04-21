<template>
  <div class="auth-container uk-container">
    <div class="auth__content">
      <div>
        <router-link class="auth__logo" to="/" v-e2e="'logo'">
          <core-svg width="32" class="logo --no-stroke" :src="require('@/assets/images/logo.svg')" />
          <span class="auth__logo-text --from-tablet">{{ $t('auth.shared.logo') }}</span>
        </router-link>
        <h2 class="auth__title">{{ $t('auth.views.changePassword.title') }}</h2>
        <p class="auth__hint">{{ $t('auth.views.changePassword.hint') }}</p>
      </div>

      <div class="--to-tablet">
        <core-svg class="auth__bg-icon --no-stroke" :src="require('@/assets/images/auth/gray-bg.svg')" />
        <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/reset-password.svg')" />
      </div>

      <v-form
        name="change-password"
        class="auth__form"
        @submit="onSubmit"
        v-slot="{ isSubmitting, validate }"
        v-e2e
      >
        <div class="auth__form-control">
          <label class="auth__label" for="password">{{ $t('auth.shared.password') }}</label>
          <div class="input-container --with-icon">
            <core-svg class="input-icon --prefix" width="20" :src="require('@/assets/images/icons/lock.svg')" />
            <v-field
              id="password"
              class="uk-input"
              name="password"
              type="password"
              :placeholder="$t('auth.shared.password')"
              rules="required|min:8"
              v-e2e
            />
            <v-error-message class="input-error-message" name="password" />
          </div>
        </div>

        <div class="auth__form-control">
          <label class="auth__label" for="confirmation">{{ $t('auth.views.changePassword.confirmPassword') }}</label>
          <div class="input-container --with-icon">
            <core-svg class="input-icon --prefix" width="20" :src="require('@/assets/images/icons/lock.svg')" />
            <v-field
              id="confirmation"
              class="uk-input"
              name="confirmation"
              type="password"
              :placeholder="$t('auth.views.changePassword.confirmPassword')"
              rules="required|confirmed:password"
              v-e2e
            />
            <v-error-message class="input-error-message" name="confirmation" />
          </div>
        </div>
        <button
          type="submit"
          class="uk-button uk-button-primary auth__btn"
          :disabled="isSubmitting"
          v-e2e
          @click="handleSubmitClick({ validate })"
        >
          {{ $t('auth.views.changePassword.changePassword') }}</button>
      </v-form>
    </div>
    <div class="auth__figure --from-tablet --tablet-icon">
      <core-svg
        class="auth__login-bg-desktop --no-stroke"
        :src="require('@/assets/images/auth/gray-bg-desktop.svg')"
      />
      <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/reset-password.svg')" />
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';

import { changePasswordRequest } from '../services';

export default {
  components: {
    'v-form': Form,
    'v-field': Field,
    'v-error-message': ErrorMessage,
  },
  setup() {
    const uikit = useKit();
    const route = useRoute();
    const router = useRouter();
    const i18n = useI18n();

    const { formErrorFormatter } = useApiFormatters();

    const onSubmit = async (values, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      try {
        await changePasswordRequest(values, route.query);

        router.push({ name: 'signin' });

        uikit.notify('success', i18n.t('auth.views.changePassword.success'));
      } catch (error) {
        const errors = formErrorFormatter(error);

        if (Object.keys(errors).length) {
          setErrors(errors);
          scrollToFirstInvalidControl();
        } else {
          uikit.notify('danger', error.message);
        }
      }
    };

    return { onSubmit, handleSubmitClick };
  },
};
</script>
