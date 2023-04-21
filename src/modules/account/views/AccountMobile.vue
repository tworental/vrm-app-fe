<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('account.views.main.title')" icon="account" />
    </template>
    <template #default>
      <div>
        <ul uk-accordion>
          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-middle">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/user-details.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">{{ $t('account.shared.form.details.title') }}</h3>
                </div>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')" />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <account-details-form />
            </div>
          </li>

          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-middle">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/cog.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">
                    {{ $t('account.shared.form.settings.title') }}
                  </h3>
                </div>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')" />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <account-settings-form />
            </div>
          </li>

          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-middle">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/lock.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">
                    {{ $t('account.shared.form.changePassword.title') }}
                  </h3>
                </div>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')"
              />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <account-change-password />
            </div>
          </li>
          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-top">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/google-sso.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">{{ $t('account.shared.form.google.title') }}</h3>
                </div>
                <p class="panel__description">{{ $t('account.shared.form.google.description') }}</p>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')"
              />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <account-google-sync />
            </div>
          </li>
        </ul>
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
.panel {
  border-bottom: 1px solid rgba($alt-color, 0.3);
  background-color: $color-white;

  &:first-child {
    border-top: 1px solid rgba($alt-color, 0.3);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    min-height: 70px;
    box-sizing: border-box;
    cursor: pointer;
  }

  &__content {
    padding: 0 30px 15px;
  }

  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: $base-color-darken;
  }

  &__description {
    margin: 5px 0 0;
    font-size: 0.875rem;
    color: rgba($base-color-darken, 0.7);
  }

  .arrow {
    transition: transform 0.15s linear;
  }

  &.uk-open .arrow {
    transform: rotateZ(180deg);
  }
}
</style>
