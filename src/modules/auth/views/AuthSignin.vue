<template>
  <div class="auth-container uk-container">
    <div class="auth__content">
      <div>
        <router-link class="auth__logo" to="/" v-e2e="'logo'">
          <core-svg width="32" class="logo --no-stroke" :src="require('@/assets/images/logo.svg')" />
          <span class="auth__logo-text --from-tablet">{{ $t('auth.shared.logo') }}</span>
        </router-link>
        <h2 class="auth__title">{{ $t('auth.views.signin.title') }}</h2>
        <p class="auth__hint">{{ $t('auth.views.signin.hint') }}</p>
      </div>

      <div class="--to-tablet">
        <core-svg class="auth__bg-icon --no-stroke" :src="require('@/assets/images/auth/gray-bg.svg')" />
        <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/signin.svg')" />
      </div>

      <v-form name="signin" class="auth__form" @submit="onSubmit" v-slot="{ isSubmitting, validate }" v-e2e>
        <div class="auth__form-control">
          <label class="auth__label" for="email">{{ $t('auth.shared.email') }}</label>
          <div class="input-container --with-icon">
            <core-svg class="input-icon --prefix" width="20" :src="require('@/assets/images/icons/envelope.svg')" />
            <v-field
              id="email"
              class="uk-input"
              name="email"
              :placeholder="$t('auth.shared.email')"
              value=""
              rules="required|email"
              v-e2e
            />
            <v-error-message class="input-error-message" name="email" />
          </div>
        </div>

        <div class="auth__form-control">
          <label class="auth__label" for="password">{{ $t('auth.shared.password') }}</label>
          <div class="input-container --with-icon">
            <core-svg class="input-icon --prefix" width="20" :src="require('@/assets/images/icons/lock.svg')" />
            <core-svg
              v-if="isPasswordVisible"
              @click="isPasswordVisible = !isPasswordVisible"
              class="input-icon --suffix cursor-pointer"
              width="20"
              :src="require('@/assets/images/icons/eye-close.svg')"
            />
            <core-svg
              v-else
              @click="isPasswordVisible = !isPasswordVisible"
              class="input-icon --suffix cursor-pointer"
              width="20"
              :src="require('@/assets/images/icons/eye-open.svg')"
            />
            <v-field
              id="password"
              class="uk-input"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :placeholder="$t('auth.shared.password')"
              value=""
              rules="required"
              v-e2e
            />
            <v-error-message class="input-error-message" name="password" />
          </div>
          <div class="uk-text-right auth__link">
            <router-link
              :to="{ name: 'forgot-password' }"
              v-e2e="'forgot-password'"
            >{{ $t('auth.views.signin.forgotPassword') }}</router-link>
          </div>
        </div>

        <button
          class="uk-button uk-button-primary auth__btn"
          :disabled="isSubmitting"
          @click="handleSubmitClick({ validate })"
          v-e2e
        >
          {{$t('auth.views.signin.signIn')}}
        </button>
        <p class="auth__btn-hint">{{$t('auth.views.signin.orConnectWith')}}</p>
        <button
          type="button"
          class="uk-button uk-button-default auth__btn auth__btn-google"
          v-e2e="'google'"
          :disabled="googleLoading"
          @click="signInGoogleViaGoogle"
        >
          <div v-if="googleLoading" class="google-loading" uk-spinner="ratio: 0.5"></div>
          <template v-else>
            <core-svg width="24" height="24" class="--no-stroke" :src="require('@/assets/images/icons/google.svg')" />
            <span class="uk-display-inline">{{ $t('auth.views.signin.google') }}</span>
          </template>
        </button>
      </v-form>
    </div>
    <div class="auth__figure --from-tablet">
      <core-svg
        class="auth__login-bg-desktop --no-stroke"
        :src="require('@/assets/images/auth/gray-bg-desktop.svg')"
      />
      <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/signin.svg')" />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from 'vee-validate';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { googleAuthRequest } from '@/modules/auth/services';

export default {
  components: {
    'v-form': Form,
    'v-field': Field,
    'v-error-message': ErrorMessage,
  },
  setup() {
    const uikit = useKit();
    const store = useStore();

    const { formErrorFormatter } = useApiFormatters();

    const isPasswordVisible = ref(false);
    const googleLoading = ref(false);

    const appVersion = computed(() => store.state.core.appVersion);

    const onSubmit = async (values, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      try {
        await store.dispatch('auth/signin', values)
          .then(() => { window.top.location.href = '/'; });
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

    const signInGoogleViaGoogle = () => {
      googleLoading.value = true;

      googleAuthRequest()
        .then(({ data }) => {
          window.location.href = data;
        });
    };

    return {
      googleLoading,
      isPasswordVisible,

      onSubmit,
      appVersion,
      handleSubmitClick,
      signInGoogleViaGoogle,
    };
  },
};
</script>
