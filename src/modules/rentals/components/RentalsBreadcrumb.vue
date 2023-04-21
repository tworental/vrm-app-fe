<template>
  <ul class="uk-breadcrumb uk-margin-small-top uk-margin-remove-bottom uk-width-1-1">
    <li>
      <router-link :to="{ name: 'rentals' }">
        {{ $t('rentals.components.breadcrumb.title') }}
      </router-link>
    </li>
    <li><router-link :to="{ name: 'rental-overview', params: { id: rental.id } }">{{ rental?.name }}</router-link></li>
    <li v-if="$route.params.rentalTypeId">
      <router-link
        :to="{ name: 'rental-type-overview', params: { id: rental.id, rentalTypeId: $route.params.rentalTypeId } }"
      >
        {{ selectedRentalType?.name }}
      </router-link>
    </li>
    <li v-if="$route.params.rentalTypeUnitId">
      <router-link
        :to="{
          name: 'rental-type-unit-overview',
          params: {
            id: rental.id,
            rentalTypeId: $route.params.rentalTypeId,
            rentalTypeUnitId: $route.params.rentalTypeUnitId,
          }
        }"
      >
        {{ selectedUnit?.name || '-' }}
      </router-link>
    </li>
    <li><span>{{ title }}</span></li>
  </ul>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    const store = useStore();

    const rental = computed(() => store.state.rentals.rentals.entity);
    const selectedRentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const selectedUnit = computed(() => store.state.rentals.units.entity);

    return { rental, selectedRentalType, selectedUnit };
  },
};
</script>

<style lang="scss" scoped>
.uk-breadcrumb > * > * {
  color: rgba($base-color-darken, 0.5);
  text-decoration: none;
}
.uk-breadcrumb > :last-child > span {
  color: $base-color-darken;
}
.uk-breadcrumb > :nth-child(n+2):not(.uk-first-column)::before {
  margin: 0 10px 0 calc(15px - 4px);
}
</style>
