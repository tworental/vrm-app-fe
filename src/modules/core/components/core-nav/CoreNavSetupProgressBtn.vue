<template>
  <div class="uk-inline" v-if="setupPercentage < 100">
    <router-link
      :to="{ name: 'onboarding' }"
      v-e2e="'onboarding'"
      class="navbar__button"
    >
      <core-circular-progress
        :radius="16"
        :strokeWidth="4"
        strokeColor="#2E3192"
        textColor="#3E3F42"
        :value="setupPercentage"
      />
    </router-link>
  </div>
</template>

<script>
import { computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

import { LIMITS, hasAccess } from '@/utils/acl';
import CoreCircularProgress from '../CoreCircularProgress.vue';

export default {
  name: 'CoreNavSetupProgressBtn',
  components: {
    CoreCircularProgress,
  },
  setup() {
    const store = useStore();

    const limits = computed(() => store.state.core.limits);
    const setupPercentage = computed(() => store.state.account.setupPercentage);

    onBeforeMount(() => {
      if (hasAccess(limits.value, LIMITS.APP_ONBOARDING_ENABLED)) {
        store.dispatch('account/setSetupProgress');
      }
    });

    return {
      setupPercentage,
    };
  },
};
</script>
