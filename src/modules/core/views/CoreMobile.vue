<template>
  <core-layout :core="true">
    <template #nav>
      <core-nav-mobile />
    </template>

    <template #default>
      <router-view />
    </template>
  </core-layout>
</template>

<script>
import CoreNavMobile from '../components/core-nav/CoreNavMobile.vue';

export default {
  name: 'CoreMobile',
  components: {
    CoreNavMobile,
  },
};
</script>
