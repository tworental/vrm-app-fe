<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('account.views.main.title')" icon="account" />
    </template>
    <template #default>
      <div class="profile-wrapper">
        <div class="form-card uk-margin-bottom">
          <div class="uk-flex uk-flex-middle">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/user-details.svg')"
            />
            <h3 class="form-card__title uk-margin-small-left">{{ $t('account.shared.form.details.title') }}</h3>
          </div>

          <account-details-form class="form-card__form" />
        </div>
        <div class="form-card uk-margin-bottom">
          <div class="uk-flex uk-flex-middle">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/cog.svg')"
            />
            <h3 class="form-card__title uk-margin-small-left">{{ $t('account.shared.form.settings.title') }}</h3>
          </div>

          <account-settings-form class="form-card__form" />
        </div>
        <div class="form-card uk-margin-bottom">
          <div class="uk-flex uk-flex-middle">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/lock.svg')"
            />
            <h3 class="form-card__title uk-margin-small-left">{{ $t('account.shared.form.changePassword.title') }}</h3>
          </div>

          <account-change-password class="form-card__form" />
        </div>
        <div class="form-card uk-margin-bottom">
          <div class="uk-flex uk-flex-top">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/google-sso.svg')"
            />
            <h3 class="form-card__title uk-margin-small-left">{{ $t('account.shared.form.google.title') }}</h3>
          </div>
          <p class="form-card__description">{{ $t('account.shared.form.google.description') }}</p>

          <account-google-sync class="form-card__form" />
        </div>
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import AccountDetailsForm from '../components/AccountDetailsForm.vue';
import AccountSettingsForm from '../components/AccountSettingsForm.vue';
import AccountChangePassword from '../components/AccountChangePassword.vue';
import AccountGoogleSync from '../components/AccountGoogleSync.vue';

export default {
  components: {
    AccountDetailsForm,
    AccountSettingsForm,
    AccountChangePassword,
    AccountGoogleSync,
  },
};
</script>

<style lang="scss" scoped>
.profile-wrapper {
  padding: 0 30px;
}
.form-card {
  padding: 24px 30px;
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;
  max-width: 640px;

  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: $base-color-darken;
  }

  &__description {
    margin: 5px 0 0;
    font-size: 0.875rem;
    color: rgba($base-color-darken, 0.7);
  }

  &__form {
    margin-top: 20px;
  }
}
</style>
