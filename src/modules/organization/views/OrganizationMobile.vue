<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('organization.views.main.title')" icon="organization" />
    </template>
    <template #default>
      <div>
        <ul uk-accordion>
          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <h3 class="panel__title">
                  <core-svg :width="14" :height="14" :src="require('@/assets/images/icons/hyperlink.svg')" />
                  <div class="uk-margin-small-left">{{ $t('organization.shared.form.domainSettings.title') }}</div>
                </h3>
                <p class="panel__description">{{ $t('organization.shared.form.domainSettings.description') }}</p>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')"
              />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <organization-domain-settings />
            </div>
          </li>

          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <h3 class="panel__title">
                  <core-svg :width="14" :height="14" :src="require('@/assets/images/icons/circle-info.svg')" />
                  <div class="uk-margin-small-left">{{ $t('organization.shared.form.globalSettings.title') }}</div>
                </h3>
                <p class="panel__description">{{ $t('organization.shared.form.globalSettings.description') }}</p>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')"
              />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <organization-global-settings />
            </div>
          </li>

          <li class="panel uk-margin-remove">
            <div class="uk-accordion-title panel__header">
              <div>
                <h3 class="panel__title">
                  <core-svg :width="14" :height="14" :src="require('@/assets/images/icons/company-data.svg')" />
                  <div class="uk-margin-small-left">{{ $t('organization.shared.form.companyData.title') }}</div>
                </h3>
                <p class="panel__description">{{ $t('organization.shared.form.companyData.description') }}</p>
              </div>

              <core-svg
                width="12"
                class="arrow"
                :src="require('@/assets/images/icons/arrow-down.svg')"
              />
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <organization-company-settings />
            </div>
          </li>
        </ul>
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
    display: flex;
    align-items: center;
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
