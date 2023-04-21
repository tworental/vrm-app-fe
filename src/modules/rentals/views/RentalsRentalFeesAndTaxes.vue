<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header
        :title="$t('rentals.views.feesAndTaxes.title')"
        icon="calendar"
        class="uk-flex-wrap"
      >
        <rentals-breadcrumb :title="$t('rentals.views.feesAndTaxes.title')" />
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <rentals-rental-fees
          class="uk-margin-bottom"
        />
        <rentals-rental-taxes
          class="uk-margin-bottom"
        />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { LIMITS, MODULES } from '@/utils/acl';
import RentalsBreadcrumb from '../components/RentalsBreadcrumb.vue';
import RentalsRentalFees from '../components/RentalsRentalFees.vue';
import RentalsRentalTaxes from '../components/RentalsRentalTaxes.vue';

export default {
  components: {
    RentalsBreadcrumb,
    RentalsRentalFees,
    RentalsRentalTaxes,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);

    return {
      LIMITS,
      MODULES,
      user,
      limits,
    };
  },
};
</script>
