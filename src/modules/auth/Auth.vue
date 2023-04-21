<template>
  <div class="auth" :class="$route.name">
    <router-view />
    <core-app-version v-if="!isLoggedIn" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import CoreAppVersion from '@/modules/core/components/CoreAppVersion.vue';

export default {
  components: {
    CoreAppVersion,
  },
  setup() {
    const store = useStore();

    const isLoggedIn = computed(() => store.state.auth.isLoggedIn);

    return { isLoggedIn };
  },
};
</script>
