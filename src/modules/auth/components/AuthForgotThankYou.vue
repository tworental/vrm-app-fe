<template>
  <div class="auth-container uk-container">
    <div class="auth__content">
      <div>
        <router-link class="auth__logo" to="/" v-e2e="'logo'">
          <core-svg width="32" class="logo --no-stroke" :src="require('@/assets/images/logo.svg')" />
          <span class="auth__logo-text --from-tablet">{{ $t('auth.shared.logo') }}</span>
        </router-link>
        <h2 class="auth__title">{{ $t('auth.components.forgotThankYou.title') }}</h2>
        <p class="auth__hint">{{ $t('auth.components.forgotThankYou.hint') }}</p>
      </div>

      <div class="--to-tablet">
        <core-svg class="auth__bg-icon --no-stroke" :src="require('@/assets/images/auth/gray-bg.svg')" />
        <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/reset-link-sent.svg')" />
      </div>
    </div>

    <div class="auth__figure --from-tablet">
      <core-svg
        class="auth__login-bg-desktop --no-stroke"
        :src="require('@/assets/images/auth/gray-bg-desktop.svg')"
      />
      <core-svg class="auth__main-icon --no-stroke" :src="require('@/assets/images/auth/reset-link-sent.svg')" />
    </div>
  </div>
</template>
