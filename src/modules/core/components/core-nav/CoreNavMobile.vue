<template>
  <nav class="navbar navbar--dark uk-navbar-container horizontal uk-navbar" uk-navbar="mode: click">
    <div class="--to-wide-mobile">
      <button
        v-if="!isNavClosed"
        class="navbar__button uk-button uk-button-text"
        v-e2e="'menu'"
        @click="onOpenMenu"
      >
        <core-svg :width="24" :src="require('@/assets/images/icons/hamburger.svg')" />
      </button>
      <button
        v-else
        class="uk-button uk-button-text"
        v-e2e="'submenu-show'"
        @click="onShowSubmenu"
      >
        <core-svg :width="24" :src="require('@/assets/images/icons/long-arrow-left.svg')" />
      </button>
    </div>
    <div class="--from-wide-mobile">
      <button
        class="navbar__button uk-button uk-button-text"
        v-e2e="'menu'"
        @click="onOpenMenu"
      >
        <core-svg :width="24" :src="require('@/assets/images/icons/hamburger.svg')" />
      </button>
    </div>

    <router-link to="/" v-e2e="'logo'">
      <core-svg class="logo" :width="33" :src="require('@/assets/images/logo.svg')" />
    </router-link>

    <div>
      <core-nav-avatar-mobile-btn />
    </div>
    <core-nav-mobile-sidebar v-model="isSidebarOpened" />
  </nav>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import CoreNavMobileSidebar from './CoreNavMobileSidebar.vue';
import CoreNavAvatarMobileBtn from './CoreNavAvatarMobileBtn.vue';

export default {
  name: 'CoreNavMobile',
  components: {
    CoreNavMobileSidebar,
    CoreNavAvatarMobileBtn,
  },
  setup() {
    const store = useStore();

    const isSidebarOpened = ref(false);

    const isNavClosed = computed(() => store.state.core.submenuClosed);

    const onOpenMenu = () => {
      isSidebarOpened.value = true;
    };

    const onShowSubmenu = () => {
      store.commit('core/SET_SUBMENU_CLOSED', false);
    };

    return {
      isNavClosed,
      isSidebarOpened,

      onOpenMenu,
      onShowSubmenu,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  --navbar-width: 100%;
  justify-content: space-between;
  flex-direction: row;

  .logo {
    margin: 0;
  }

  ::v-deep() &__button {
    padding: 0;
  }
  ::v-deep() .uk-badge {
    top: -8px;
  }
}
</style>
