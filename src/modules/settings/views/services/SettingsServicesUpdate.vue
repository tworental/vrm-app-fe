<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.views.servicesUpdate.title')" icon="content-paper" />
    </template>

    <template #default>
      <div class="content">
        <settings-service-info
          class="uk-margin-bottom"
        />
        <settings-service-notifications
          class="uk-margin-bottom"
        />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import SettingsServiceInfo from '../../components/services/SettingsServiceInfo.vue';
import SettingsServiceNotifications from '../../components/services/SettingsServiceNotifications.vue';

export default {
  components: {
    SettingsServiceInfo,
    SettingsServiceNotifications,
  },
};
</script>
