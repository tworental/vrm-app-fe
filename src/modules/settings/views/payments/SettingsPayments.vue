<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="'Payment Settings'" icon="guests" />
    </template>

    <template #default>
      <router-link v-e2e="'cc-edit'"
        :uk-tooltip="'title: Enable'"
        :to="{ name: 'settings-payments-cc' }"
      >
        Credit Card
      </router-link>
      <br />

      <router-link v-e2e="'paypal-edit'"
        :uk-tooltip="'title: Enable'"
        :to="{ name: 'settings-payments-paypal' }"
      >
        PayPal
      </router-link>
      <br />
      <router-link v-e2e="'bank-edit'"
        :uk-tooltip="'title: Enable'"
        :to="{ name: 'settings-payments-bank-account' }"
      >
        Bank Account
      </router-link>
    </template>
  </core-layout-content>

  <core-drawer ref="drawerRef">
    <router-view />
  </core-drawer>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';

export default {
  components: {
    CoreDrawer,
  },
  setup() {
    const uikit = useKit();
    const route = useRoute();
    const router = useRouter();

    const drawerRef = ref(null);

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'settings-payments' });
      });
    });

    return {
      drawerRef,
    };
  },
};
</script>
