<template>
  <component :is="deviceComponent"></component>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import AccountDesktop from './views/AccountDesktop.vue';
import AccountMobile from './views/AccountMobile.vue';

export default {
  components: {
    AccountDesktop,
    AccountMobile,
  },
  setup() {
    const store = useStore();

    const deviceComponent = computed(
      () => (store.getters['core/isMobile'] ? AccountMobile : AccountDesktop),
    );

    return {
      deviceComponent,
    };
  },
};
</script>
