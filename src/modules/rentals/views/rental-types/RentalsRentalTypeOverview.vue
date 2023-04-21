<template>
  <v-form
    v-slot="{ errors, values, validate }"
    class="uk-height-1-1"
    name="rentalTypeOverview"
    @submit="onSubmit"
    v-e2e
  >
    <core-layout-content :isLoading="rentalTypeLoading">
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
          <rentals-rental-type-info
            class="uk-margin-bottom"
            :rental-type="selectedRentalType"
            :unit="unit"
            :form-values="values"
            :errors="errors"
          />
          <rentals-rooms
            :arrangements="arrangements.filter((item) => item.type === arrangementTypes.ROOMS)"
            class="uk-margin-bottom"
          />
          <rentals-sleeping-arrangements
            :arrangements="arrangements.filter((item) => item.type === arrangementTypes.SLEEPING)"
            class="uk-margin-bottom"
          />
          <rentals-rental-amenities :amenities="amenities" ctx="unitType" class="uk-margin-bottom" />
        </div>
      </template>
      <template #footer>
        <footer class="footer" v-can:properties.delete="user">
          <button
            type="submit"
            class="uk-button uk-button-success"
            :disabled="loading"
            v-e2e
            @click="handleSubmitClick({ validate })"
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('rentals.shared.save') }}
          </button>
        </footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { hasAccess, LIMITS } from '@/utils/acl';
import RentalsBreadcrumb from '../../components/RentalsBreadcrumb.vue';
import RentalsRentalTypeInfo from '../../components/RentalsRentalTypeInfo.vue';
import RentalsRooms from '../../components/RentalsRooms.vue';
import RentalsSleepingArrangements from '../../components/RentalsSleepingArrangements.vue';
import RentalsRentalAmenities from '../../components/RentalsRentalAmenities.vue';

export default {
  components: {
    VForm: Form,
    RentalsBreadcrumb,
    RentalsRentalTypeInfo,
    RentalsRooms,
    RentalsSleepingArrangements,
    RentalsRentalAmenities,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);

    const rental = computed(() => store.state.rentals.rentals.entity);
    const selectedRentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const rentalTypeLoading = computed(() => store.state.rentals.rentalTypes.entityLoading);
    const unit = computed(() => store.state.rentals.units.entity);
    const arrangements = computed(() => store.getters['rentals/rentalTypes/arrangements']);
    const arrangementTypes = computed(() => store.state.rentals.dicts.arrangementsTypes);
    const amenities = computed(() => store.getters['rentals/rentalTypes/amenities']);
    const user = computed(() => store.state.account.user);

    const areUnitFieldsVisible = computed(
      () => !hasAccess(store.state.core.limits, LIMITS.APP_PROPERTIES_UNITS_ENABLED),
    );

    const updateSingleUnit = ({
      floor,
      status,
      isActive,
    }) => store.dispatch('rentals/units/updateUnit', {
      id: unit.value.id,
      propertyId: rental.value.id,
      propertyUnitTypeId: selectedRentalType.value.id,
      floor,
      status,
      isActive,
    });

    const onSubmit = ({ rooms, sleeping, ...values }, { setErrors }) => {
      loading.value = true;

      store.dispatch('rentals/rentalTypes/updateRentalType', {
        id: selectedRentalType.value.id,
        propertyId: rental.value.id,
        ...values,
        arrangements: [...rooms, ...sleeping],
      })
        .then(() => areUnitFieldsVisible.value && updateSingleUnit(values))
        .then(() => uikit.notify('success', i18n.t('rentals.views.overview.successUpdate')))
        .then(() => Promise.all([
          store.dispatch('rentals/rentals/setRental', rental.value.id),
          store.dispatch('rentals/rentalTypes/setRentalType', {
            propertyId: rental.value.id,
            id: selectedRentalType.value.id,
          }),
        ]))
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
    };

    return {
      rental,
      loading,
      selectedRentalType,
      rentalTypeLoading,
      unit,
      arrangements,
      arrangementTypes,
      amenities,
      user,

      handleSubmitClick,
      onSubmit,
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
