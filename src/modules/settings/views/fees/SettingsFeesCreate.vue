<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.shared.menu.fees')" icon="cash-molecule" />
    </template>

    <template #default>
      <div class="content">
        <settings-fee-info
          class="uk-margin-bottom"
          :title="$t('settings.components.feeInfo.titleCreate')"
        />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import SettingsFeeInfo from '../../components/fees/SettingsFeeInfo.vue';

export default {
  components: { SettingsFeeInfo },
};
</script>
