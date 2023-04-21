<template>
  <nav class="navbar navbar--dark uk-navbar-container vertical uk-navbar no-print" uk-navbar="mode: click">
    <router-link to="/" v-e2e="'logo'">
      <core-svg class="logo" :width="33" :src="require('@/assets/images/logo.svg')" />
    </router-link>

    <core-nav-menu />

    <div class="navbar__bottom">
      <core-nav-avatar-btn />
    </div>
  </nav>
</template>

<script>
import CoreNavMenu from './CoreNavMenu.vue';
import CoreNavAvatarBtn from './CoreNavAvatarBtn.vue';

export default {
  name: 'CoreNav',
  components: {
    CoreNavMenu,
    CoreNavAvatarBtn,
  },
};
</script>
