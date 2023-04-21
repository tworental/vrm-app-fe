<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header
        :title="$t('rentals.views.customerContacts.title')"
        icon="house-person"
        class="uk-flex-wrap"
      >
        <rentals-breadcrumb :title="$t('rentals.views.customerContacts.title')" />
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <rentals-rental-customer-contacts-table class="uk-margin-bottom" />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import RentalsBreadcrumb from '../components/RentalsBreadcrumb.vue';
import RentalsRentalCustomerContactsTable from '../components/RentalsRentalCustomerContactsTable.vue';

export default {
  components: {
    RentalsRentalCustomerContactsTable,
    RentalsBreadcrumb,
  },
};
</script>
