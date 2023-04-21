<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('organization.views.main.title')" icon="organization" />
    </template>
    <template #default>
      <div class="profile-wrapper">
        <div class="form-card uk-margin-bottom">
          <div>
            <h3 class="form-card__title">
              <core-svg :width="16" :height="16" :src="require('@/assets/images/icons/hyperlink.svg')" />
              <div class="uk-margin-small-left">{{ $t('organization.shared.form.domainSettings.title') }}</div>
            </h3>
          </div>
          <p class="form-card__description">{{ $t('organization.shared.form.globalSettings.description') }}</p>
          <organization-domain-settings class="uk-margin-top" />
        </div>
        <div class="form-card uk-margin-bottom">
          <h3 class="form-card__title">
            <core-svg :width="16" :height="16" :src="require('@/assets/images/icons/circle-info.svg')" />
            <div class="uk-margin-small-left">{{ $t('organization.shared.form.globalSettings.title') }}</div>
          </h3>
          <p class="form-card__description">{{ $t('organization.shared.form.globalSettings.description') }}</p>
          <organization-global-settings class="uk-margin-top" />
        </div>
        <div class="form-card uk-margin-bottom">
          <h3 class="form-card__title">
            <core-svg :width="16" :height="16" :src="require('@/assets/images/icons/company-data.svg')" />
            <div class="uk-margin-small-left">{{ $t('organization.shared.form.companyData.title') }}</div>
          </h3>
          <p class="form-card__description">{{ $t('organization.shared.form.companyData.description') }}</p>
          <organization-company-settings class="uk-margin-top" />
        </div>
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import OrganizationDomainSettings from '../components/OrganizationDomainSettings.vue';
import OrganizationGlobalSettings from '../components/OrganizationGlobalSettings.vue';
import OrganizationCompanySettings from '../components/OrganizationCompanySettings.vue';

export default {
  components: {
    OrganizationDomainSettings,
    OrganizationGlobalSettings,
    OrganizationCompanySettings,
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
    display: flex;
    align-items: center;
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
