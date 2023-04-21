<template>
  <component :is="deviceComponent"></component>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import OrganizationDesktop from './views/OrganizationDesktop.vue';
import OrganizationMobile from './views/OrganizationMobile.vue';

export default {
  components: {
    OrganizationDesktop,
    OrganizationMobile,
  },
  setup() {
    const store = useStore();

    const deviceComponent = computed(
      () => (store.getters['core/isMobile'] ? OrganizationMobile : OrganizationDesktop),
    );

    return {
      deviceComponent,
    };
  },
};
</script>
