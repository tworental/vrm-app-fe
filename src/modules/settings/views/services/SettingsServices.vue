<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.views.services.title')" icon="cog-hand" />
    </template>

    <template #default>
      <div class="content">
        <settings-services-table class="uk-margin-bottom" />
        <settings-service-providers-table class="uk-margin-bottom" />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import SettingsServicesTable from '../../components/services/SettingsServicesTable.vue';
import SettingsServiceProvidersTable from '../../components/services/SettingsServiceProvidersTable.vue';

export default {
  components: {
    SettingsServiceProvidersTable,
    SettingsServicesTable,
  },
};
</script>
