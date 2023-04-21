<template>
  <div class="uk-height-1-1">
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('rentals.views.seasonRatesOverview.title')"
          icon="rates"
          class="uk-flex-wrap"
        >
          <rentals-breadcrumb :title="$t('rentals.views.seasonRatesOverview.title')" />
        </core-layout-content-header>
      </template>
      <template #default>
        <div class="content">
          <core-season-rate-info
            class="uk-margin-bottom"
            :rates="rates"
            :form-values="values"
            :errors="errors"
            :currency="currency"
            :ranges="ranges.filter((range) => range.id !== rates.id)"
            @setValues="setValues({ ...values, ...$event })"
            @setBaseValues="setBaseValues"
          />
          <rentals-price-per-weekday
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
            @setValues="setValues({ ...values, ...$event })"
            @validateField="validateField"
            @setBaseValues="setBaseValues"
          />
          <core-rates-minimum-stay-per-weekday
            class="uk-margin-bottom"
            :rates="rates"
            :rental-type="rentalType"
            :errors="errors"
            :form-values="values"
            :submitCount="submitCount"
            @setValues="setValues({ ...values, ...$event })"
            @validateField="validateField"
          />
          <core-rates-length-of-stay-prices
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
            @setValues="setValues({ ...values, ...$event })"
            @setBaseValues="setBaseValues"
            @setErrors="setErrors"
          />
          <core-rates-check-restrictions
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
            @setValues="setValues({ ...values, ...$event })"
            @setBaseValues="setBaseValues"
          />
        </div>
      </template>
      <template #footer>
        <footer class="footer">
          <button
            type="submit"
            class="uk-button uk-button-success"
            :disabled="loading"
            v-e2e
            @click="handleSubmitClick({ validate, onSubmit }, '.--invalid, input.--error')"
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
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { showModalForDirtyForm } from '@/utils/modal';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import RentalsBreadcrumb from '@/modules/rentals/components/RentalsBreadcrumb.vue';
import CoreRatesLengthOfStayPrices from '@/modules/core/components/rates/CoreRatesLengthOfStayPrices.vue';
import CoreRatesMinimumStayPerWeekday from '@/modules/core/components/rates/CoreRatesMinimumStayPerWeekday.vue';
import CoreRatesCheckRestrictions from '@/modules/core/components/rates/CoreRatesCheckRestrictions.vue';
import CoreSeasonRateInfo from '@/modules/core/components/rates/CoreSeasonRateInfo.vue';
import RentalsPricePerWeekday from '../components/rates/RentalsPricePerWeekday.vue';

export default {
  components: {
    RentalsBreadcrumb,
    CoreRatesLengthOfStayPrices,
    CoreRatesMinimumStayPerWeekday,
    RentalsPricePerWeekday,
    CoreRatesCheckRestrictions,
    CoreSeasonRateInfo,
  },
  setup() {
    const uikit = useKit();
    const store = useStore();
    const i18n = useI18n();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const {
      values: formValues,
      errors: formErrors,
      validate,
      meta,
      handleSubmit,
      setErrors,
      resetForm,
      setValues,
      validateField,
      submitCount,
    } = useForm();

    const loading = ref(false);

    const ranges = computed(() => store.state.rentals.seasonRates.list);
    const rates = computed(() => store.state.rentals.seasonRates.entity);
    const rentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const currency = computed(() => store.state.rentals.rentalTypes.rates.currency);

    const onSubmit = handleSubmit((values) => {
      loading.value = true;

      store.dispatch('rentals/seasonRates/update', {
        propertyId: store.state.rentals.rentalTypes.entity.propertyId,
        propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
        id: route.params.rateId,
        data: values,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.rates.successUpdate')))
        .then(() => store.dispatch('rentals/seasonRates/setList', {
          propertyId: route.params.id,
          propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
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
        .finally(() => {
          loading.value = false;
          resetForm({
            values: formValues,
            dirty: false,
          });
        });
    });

    onBeforeRouteLeave(showModalForDirtyForm({
      uikit,
      i18n,
      meta,
    }));

    const setBaseValues = (values) => {
      resetForm({
        values: {
          ...formValues,
          ...values,
        },
        dirty: false,
      });
    };

    return {
      rates,
      rentalType,
      loading,
      currency,
      ranges,
      values: formValues,
      errors: formErrors,
      submitCount,

      onSubmit,
      handleSubmitClick,
      setBaseValues,
      setValues,
      setErrors,
      validate,
      validateField,
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
