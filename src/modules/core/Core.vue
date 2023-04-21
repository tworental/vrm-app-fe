<template>
  <template v-if="isLoggedIn">
    <component :is="deviceComponent" />
  </template>

  <template v-else>
    <router-view />
  </template>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useNetwork } from '@vueuse/core';

import useKit from '@/modules/core/composables/uikit';
import CoreDesktop from './views/CoreDesktop.vue';
import CoreMobile from './views/CoreMobile.vue';

export default {
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();
    const { isOnline } = useNetwork();

    const isLoggedIn = computed(() => store.state.auth.isLoggedIn);

    watch(isOnline, (value) => {
      if (!value) {
        uikit.notify('danger', i18n.t('core.notifications.danger.networkConnection'));
      }
    });

    const deviceComponent = computed(
      () => (store.getters['core/isMobile'] ? CoreMobile : CoreDesktop),
    );

    return { isLoggedIn, deviceComponent };
  },
};
</script>
