<template>
  <div class="uk-height-1-1">
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('settings.views.seasonRatesOverview.title')"
          icon="rates"
          class="uk-flex-wrap"
        />
      </template>
      <template #default>
        <div class="content">
          <settings-global-season-rate-info
            class="uk-margin-bottom"
            :rates="rates"
            :form-values="values"
            :errors="errors"
            :currency="rates.currency"
            @setBaseValues="setBaseValues"
          />
          <core-rates-details
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
          />
          <settings-global-rates-price-per-weekday
            class="uk-margin-bottom"
            :rates="rates"
            :errors="errors"
            :form-values="values"
            :submit-count="submitCount"
            @setValues="setValues({ ...values, ...$event })"
            @setErrors="setErrors"
            @validateField="validateField"
          />
          <core-rates-minimum-stay-per-weekday
            class="uk-margin-bottom"
            :rates="rates"
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
            type="button"
            class="uk-button uk-button-link uk-margin-right"
            v-e2e="'cancel-season-rate'"
            @click="$router.push({
              name: 'settings-season-rates'
            })"
          >
            {{ $t('settings.shared.cancel') }}
          </button>
          <button
            type="submit"
            class="uk-button uk-button-success"
            :disabled="loading"
            v-e2e="'season-rate'"
            @click="handleSubmitClick({ validate, onSubmit }, '.--invalid, .--error')"
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('settings.shared.save') }}
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
import CoreRatesDetails from '@/modules/core/components/rates/CoreRatesDetails.vue';
import CoreRatesLengthOfStayPrices from '@/modules/core/components/rates/CoreRatesLengthOfStayPrices.vue';
import CoreRatesMinimumStayPerWeekday from '@/modules/core/components/rates/CoreRatesMinimumStayPerWeekday.vue';
import CoreRatesCheckRestrictions from '@/modules/core/components/rates/CoreRatesCheckRestrictions.vue';
import SettingsGlobalRatesPricePerWeekday from '../../components/rates/SettingsGlobalRatesPricePerWeekday.vue';
import SettingsGlobalSeasonRateInfo from '../../components/rates/SettingsGlobalSeasonRateInfo.vue';

export default {
  components: {
    CoreRatesDetails,
    CoreRatesLengthOfStayPrices,
    CoreRatesMinimumStayPerWeekday,
    SettingsGlobalRatesPricePerWeekday,
    CoreRatesCheckRestrictions,
    SettingsGlobalSeasonRateInfo,
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
      submitCount,
      handleSubmit,
      setErrors,
      setValues,
      resetForm,
      validateField,
    } = useForm();

    const loading = ref(false);

    const ranges = computed(() => store.state.settings.seasonRates.list);
    const rates = computed(() => store.state.settings.seasonRates.entity);

    const onSubmit = handleSubmit((values) => {
      loading.value = true;

      const payload = { ...values };

      if (!payload.priceWeekdayEnabled) {
        delete payload.priceNightly;
        delete payload.priceWeekdayMo;
        delete payload.priceWeekdayTu;
        delete payload.priceWeekdayWe;
        delete payload.priceWeekdayTh;
        delete payload.priceWeekdayFr;
        delete payload.priceWeekdaySa;
        delete payload.priceWeekdaySu;
      }

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

      store.dispatch('settings/seasonRates/update', {
        id: route.params.rateId,
        ...payload,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.rates.successUpdate')))
        .then(() => resetForm({ values: formValues, dirty: false }))
        .then(() => store.dispatch('settings/seasonRates/setList'))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl('.--invalid, input.--error');
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
      loading,
      ranges,
      rates,
      submitCount,
      values: formValues,
      errors: formErrors,

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
