<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header
        :title="$t('rentals.views.services.title')"
        icon="calendar"
        class="uk-flex-wrap"
      >
        <rentals-breadcrumb :title="$t('rentals.views.services.title')" />
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <rentals-rental-services-table class="uk-margin-bottom" />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import RentalsBreadcrumb from '../components/RentalsBreadcrumb.vue';
import RentalsRentalServicesTable from '../components/RentalsRentalServicesTable.vue';

export default {
  components: {
    RentalsBreadcrumb,
    RentalsRentalServicesTable,
  },
};
</script>
