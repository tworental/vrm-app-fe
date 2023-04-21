<template>
  <v-form
    name="overview"
    v-slot="{ errors, validate }"
    class="uk-height-1-1"
    @submit="onSubmit"
    v-e2e
  >
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('rentals.views.units.title')"
          icon="bookmark"
          class="uk-flex-wrap"
        >
          <rentals-breadcrumb :title="$t('rentals.views.overview.title')" />
        </core-layout-content-header>
      </template>
      <template #default>
        <div class="content">
          <rentals-rental-type-unit-info
            class="uk-margin-bottom"
            :unit="unit"
            :errors="errors"
          />
          <rentals-sleeping-arrangements
            :arrangements="arrangements"
            class="uk-margin-bottom"
          />
          <rentals-rental-amenities
            ctx="unit"
            :amenities="amenities"
            class="uk-margin-bottom"
          />
        </div>
      </template>
      <template #footer>
        <footer class="footer">
          <button
            type="button"
            class="uk-button uk-button-link uk-margin-right"
            v-e2e="'cancel'"
            @click="$router.push({
              name: 'rental-type-units',
              params: { id: $route.params.id, rentalTypeId: $route.params.rentalTypeId },
            })"
          >
            {{ $t('rentals.shared.cancel') }}
          </button>
          <button
            v-can:properties.write="user"
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
import { Form } from 'vee-validate';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import RentalsBreadcrumb from '../../../components/RentalsBreadcrumb.vue';
import RentalsRentalTypeUnitInfo from '../../../components/RentalsRentalTypeUnitInfo.vue';
import RentalsSleepingArrangements from '../../../components/RentalsSleepingArrangements.vue';
import RentalsRentalAmenities from '../../../components/RentalsRentalAmenities.vue';

export default {
  components: {
    VForm: Form,
    RentalsBreadcrumb,
    RentalsRentalTypeUnitInfo,
    RentalsSleepingArrangements,
    RentalsRentalAmenities,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);

    const unit = computed(() => store.state.rentals.units.entity);
    const rental = computed(() => store.state.rentals.rentals.entity);
    const selectedRentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const arrangements = computed(() => store.getters['rentals/units/arrangements']);
    const amenities = computed(() => store.getters['rentals/units/amenities']);
    const user = computed(() => store.state.account.user);

    const onSubmit = ({ sleeping, ...values }, { setErrors }) => {
      loading.value = true;

      store.dispatch('rentals/units/updateUnit', {
        id: route.params.rentalTypeUnitId,
        propertyId: rental.value.id,
        propertyUnitTypeId: selectedRentalType.value.id,
        ...values,
        arrangements: [...sleeping],
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.unitOverview.updateSuccess')))
        .then(() => store.dispatch('rentals/rentalTypes/setRentalType', {
          propertyId: rental.value.id,
          id: selectedRentalType.value.id,
        }))
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
      loading,
      unit,
      arrangements,
      amenities,
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
