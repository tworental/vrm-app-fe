<template>
  <core-layout :has-nav="true" class="rentals-layout">
    <template v-slot:nav="{ onNavItemClicked }">
      <component :is="menuComponent" v-bind="{ onNavItemClicked }"></component>
    </template>
    <template #default>
      <router-view />
    </template>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import RentalsSingleUnitTypesMenu from '../components/RentalsSingleUnitTypesMenu.vue';
import RentalsMultipleUnitTypesMenu from '../components/RentalsMultipleUnitTypesMenu.vue';

export default {
  components: {
    RentalsSingleUnitTypesMenu,
    RentalsMultipleUnitTypesMenu,
  },
  setup() {
    const store = useStore();

    const rental = computed(() => store.state.rentals.rentals.entity);
    const menuComponent = computed(
      () => (rental.value.multipleUnitTypes ? RentalsMultipleUnitTypesMenu : RentalsSingleUnitTypesMenu),
    );

    return { rental, menuComponent };
  },
};
</script>
