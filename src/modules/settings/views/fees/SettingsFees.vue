<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.shared.menu.fees')" icon="cash-molecule" />
    </template>

    <template #default>
      <div class="content">
        <settings-fees-table
          class="uk-margin-bottom"
        />
        <settings-taxes-table
          class="uk-margin-bottom"
        />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { LIMITS, MODULES } from '@/utils/acl';
import SettingsFeesTable from '@/modules/settings/components/fees/SettingsFeesTable.vue';
import SettingsTaxesTable from '@/modules/settings/components/fees/SettingsTaxesTable.vue';

export default {
  components: {
    SettingsFeesTable,
    SettingsTaxesTable,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);

    return {
      LIMITS,
      MODULES,
      user,
      limits,
    };
  },
};
</script>
