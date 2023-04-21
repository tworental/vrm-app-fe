<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.shared.menu.fees')" icon="cash-molecule" />
    </template>

    <template #default>
      <div class="content">
        <settings-tax-info
          class="uk-margin-bottom"
          :title="$t('settings.components.taxInfo.titleUpdate')"
        />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import SettingsTaxInfo from '../../components/fees/SettingsTaxInfo.vue';

export default {
  components: { SettingsTaxInfo },
};
</script>
