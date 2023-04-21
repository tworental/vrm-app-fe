<template>
  <div class="uk-height-1-1">
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('rentals.views.overview.title')"
          icon="bookmark"
          class="uk-flex-wrap"
        >
          <rentals-breadcrumb :title="$t('rentals.views.overview.title')" />
        </core-layout-content-header>
      </template>
      <template #default>
        <div class="content">
          <rentals-rental-info
            class="uk-margin-bottom"
            :rental="rental"
            :rental-type="singleRentalType"
            :unit="unit"
            :form-values="values"
            :errors="errors"
          />
          <rentals-rooms
            v-if="!rental.multipleUnitTypes"
            :arrangements="arrangements.filter((item) => item.type === arrangementTypes.ROOMS)"
            class="uk-margin-bottom"
          />
          <rentals-sleeping-arrangements
            v-if="!rental.multipleUnitTypes"
            :arrangements="arrangements.filter((item) => item.type === arrangementTypes.SLEEPING)"
            class="uk-margin-bottom"
          />
          <rentals-rental-amenities :amenities="amenities" ctx="property" class="uk-margin-bottom" />
          <rentals-rental-types v-if="rental?.multipleUnitTypes" class="uk-margin-bottom" />
        </div>
      </template>
      <template #footer>
        <footer
          class="footer"
          v-can:properties.write="user"
        >
          <button
            type="submit"
            class="uk-button uk-button-success"
            :disabled="loading"
            v-e2e="'rental-overview'"
            @click="handleSubmitClick({ validate, onSubmit })"
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('rentals.shared.save') }}
          </button>
        </footer>
      </template>
    </core-layout-content>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { onBeforeRouteLeave } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { showModalForDirtyForm } from '@/utils/modal';
import { getUTCTimeByLocal } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import RentalsRentalInfo from '../components/RentalsRentalInfo.vue';
import RentalsRooms from '../components/RentalsRooms.vue';
import RentalsSleepingArrangements from '../components/RentalsSleepingArrangements.vue';
import RentalsRentalAmenities from '../components/RentalsRentalAmenities.vue';
import RentalsRentalTypes from '../components/RentalsRentalTypes.vue';
import RentalsBreadcrumb from '../components/RentalsBreadcrumb.vue';

export default {
  components: {
    RentalsRentalTypes,
    RentalsRentalInfo,
    RentalsRooms,
    RentalsSleepingArrangements,
    RentalsRentalAmenities,
    RentalsBreadcrumb,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const {
      values: formValues,
      errors: formErrors,
      validate,
      meta,
      handleSubmit,
      setErrors,
      resetForm,
    } = useForm();

    const loading = ref(false);

    const rental = computed(() => store.state.rentals.rentals.entity);
    const singleRentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const unit = computed(() => store.state.rentals.units.entity);
    const arrangements = computed(() => store.getters['rentals/rentalTypes/arrangements']);
    const arrangementTypes = computed(() => store.state.rentals.dicts.arrangementsTypes);
    const amenities = computed(() => store.getters['rentals/rentals/amenities']);
    const timezone = computed(() => store.getters['core/timezone']);
    const user = computed(() => store.state.account.user);

    const onSubmit = handleSubmit(({ rooms, sleeping, ...values }) => {
      loading.value = true;
      resetForm({ values: formValues, dirty: false });

      store.dispatch('rentals/rentals/updateRental', {
        id: rental.value.id,
        ...values,
        arrangements: !rental.value.multipleUnitTypes
          ? [...rooms, ...sleeping]
          : null,
        checkinTime: getUTCTimeByLocal(values.checkinTime, timezone.value),
        checkoutTime: getUTCTimeByLocal(values.checkoutTime, timezone.value),
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.overview.successUpdate')))
        .then(() => store.dispatch('rentals/rentals/setRental', rental.value.id))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => { loading.value = false; });
    });

    onBeforeRouteLeave(showModalForDirtyForm({
      uikit,
      i18n,
      meta,
    }));

    return {
      rental,
      singleRentalType,
      unit,
      loading,
      arrangements,
      arrangementTypes,
      amenities,
      values: formValues,
      errors: formErrors,
      validate,
      user,

      onSubmit,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.footer {
  padding: 10px;
  border-top: 1px solid rgba($alt-color, 0.2);
  text-align: center;

  .uk-button-success {
    min-width: 100px;
  }
}
</style>
