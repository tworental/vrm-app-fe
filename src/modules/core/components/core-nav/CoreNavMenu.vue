<template>
  <ul class="navbar__nav uk-nav-default uk-nav-parent-icon" uk-nav="multiple: true">
    <li v-for="(item, index) in menu" :key="index">
      <router-link
        class="navbar__link"
        :to="item.link"
        :uk-tooltip="'title: ' + $t('core.components.navMenu.' + item.id) + '; pos: right'"
        v-e2e="'menu-' + item.id"
      >
        <core-svg :width="22" :src="require('@/assets/images/icons/' + item.id + '.svg')" />
      </router-link>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const menu = computed(() => store.getters['core/menu']);

    return { menu };
  },
};
</script>
