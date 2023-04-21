<template>
  <component :is="deviceComponent" />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import OnboardingMainDesktop from './OnboardingMainDesktop.vue';
import OnboardingMainMobile from './OnboardingMainMobile.vue';

export default {
  components: {
    OnboardingMainDesktop,
    OnboardingMainMobile,
  },
  setup() {
    const store = useStore();

    store.commit('onboarding/SET_CURRENT_STEP', 'rental');

    const deviceComponent = computed(
      () => (store.getters['core/isMobile'] ? OnboardingMainMobile : OnboardingMainDesktop),
    );

    return { deviceComponent };
  },
};
</script>
