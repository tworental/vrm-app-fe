<template>
  <div
    class="uk-height-1-1"
  >
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('rentals.views.rates.title')"
          icon="rates"
          class="uk-flex-wrap"
        >
          <rentals-breadcrumb :title="$t('rentals.views.rates.title')" />
        </core-layout-content-header>
      </template>
      <template #default>
        <div class="content">
          <core-rates-details
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
          />
          <rentals-price-per-weekday
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
            @setValues="setValues({ ...values, ...$event })"
            @setBaseValues="setBaseValues"
            @validateField="validateField"
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
          <core-rates-sales-tax
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
            @setErrors="setErrors"
            @setValues="setValues({ ...values, ...$event })"
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
          <core-rates-notes
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
          />
        </div>
      </template>
      <template #footer>
        <footer class="footer" v-can:properties.write="user">
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
import { onBeforeRouteLeave } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { showModalForDirtyForm } from '@/utils/modal';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import RentalsBreadcrumb from '@/modules/rentals/components/RentalsBreadcrumb.vue';
import CoreRatesLengthOfStayPrices from '@/modules/core/components/rates/CoreRatesLengthOfStayPrices.vue';
import CoreRatesMinimumStayPerWeekday from '@/modules/core/components/rates/CoreRatesMinimumStayPerWeekday.vue';
import CoreRatesSalesTax from '@/modules/core/components/rates/CoreRatesSalesTax.vue';
import CoreRatesCheckRestrictions from '@/modules/core/components/rates/CoreRatesCheckRestrictions.vue';
import CoreRatesNotes from '@/modules/core/components/rates/CoreRatesNotes.vue';
import CoreRatesDetails from '@/modules/core/components/rates/CoreRatesDetails.vue';
import RentalsPricePerWeekday from '../components/rates/RentalsPricePerWeekday.vue';

export default {
  components: {
    RentalsBreadcrumb,
    CoreRatesLengthOfStayPrices,
    RentalsPricePerWeekday,
    CoreRatesMinimumStayPerWeekday,
    CoreRatesSalesTax,
    CoreRatesCheckRestrictions,
    CoreRatesDetails,
    CoreRatesNotes,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
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
      setFieldValue,
      validateField,
      submitCount,
    } = useForm();

    const loading = ref(false);

    const rental = computed(() => store.state.rentals.rentals.entity);
    const rentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const rates = computed(() => store.state.rentals.rentalTypes.rates);
    const user = computed(() => store.state.account.user);

    const onSubmit = handleSubmit((values) => {
      loading.value = true;

      const payload = { ...values };

      if (!payload.discountEnabled) {
        delete payload.discountType;
        delete payload.discountWeekly;
        delete payload.discountMonthly;
        delete payload.discountCustomEnabled;
        delete payload.discountCustom;
        delete payload.discountCustomPeriod;
      }

      if (!payload.minStayWeekdayEnabled) {
        delete payload.minStayWeekdayMo;
        delete payload.minStayWeekdayTu;
        delete payload.minStayWeekdayWe;
        delete payload.minStayWeekdayTh;
        delete payload.minStayWeekdayFr;
        delete payload.minStayWeekdaySa;
        delete payload.minStayWeekdaySu;
      }

      if (!payload.occupancyEnabled) {
        delete payload.occupancyStartsAfterPerson;
        delete payload.occupancyExtraCharge;
      }

      if (!payload.shortStayEnabled) {
        delete payload.shortStayDays;
        delete payload.shortStayExtraCharge;
      }

      if (!payload.selfServiceRestrictionsEnabled) {
        delete payload.selfServiceCheckinMo;
        delete payload.selfServiceCheckinTu;
        delete payload.selfServiceCheckinWe;
        delete payload.selfServiceCheckinTh;
        delete payload.selfServiceCheckinFr;
        delete payload.selfServiceCheckinSa;
        delete payload.selfServiceCheckinSu;

        delete payload.selfServiceCheckoutMo;
        delete payload.selfServiceCheckoutTu;
        delete payload.selfServiceCheckoutWe;
        delete payload.selfServiceCheckoutTh;
        delete payload.selfServiceCheckoutFr;
        delete payload.selfServiceCheckoutSa;
        delete payload.selfServiceCheckoutSu;
      }

      if (!payload.notesEnabled) {
        payload.notes = '';
        setFieldValue('notes', payload.notes);
      }

      store.dispatch('rentals/rentalTypes/updateRates', {
        propertyId: rental.value.id,
        id: rentalType.value.id,
        data: payload,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.rates.successUpdate')))
        .then(() => rental.value.multipleUnitTypes && store.dispatch('rentals/rentalTypes/setRentalType', {
          propertyId: rental.value.id,
          id: rentalType.value.id,
        }))
        .then(() => resetForm({ values: { ...formValues }, dirty: false }))
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
      user,
      values: formValues,
      errors: formErrors,
      validate,
      rental,
      rentalType,
      rates,
      loading,
      submitCount,

      onSubmit,
      setValues,
      setBaseValues,
      setErrors,
      handleSubmitClick,
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
