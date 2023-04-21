<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('bookings.components.paymentsModal.title') }}</h4>
          <p class="description">{{ $t('bookings.components.paymentsModal.description') }}</p>
          <v-form
            v-if="formVisible"
            ref="formRef"
            name="payment"
            @submit="onSubmit"
            v-slot="{ errors, validate, values }"
            v-e2e
          >
            <div class="uk-margin-top row">
              <div class="currency-select uk-margin-bottom uk-margin-right">
                <label class="input-label --required" :class="{ '--invalid': errors.currency }" for="currency">
                  {{ $t('bookings.components.paymentsModal.currency') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="currency"
                    name="currency"
                    :label="$t('bookings.components.paymentsModal.currency')"
                    :class="{ '--invalid': errors.currency }"
                    rules="required"
                    :data="currencies"
                    :value="entity?.currency || defaultCurrency"
                    :press-label="false"
                    :search="true"
                    :show-placeholder="false"
                  />
                  <v-error-message class="input-error-message" name="currency" />
                </div>
              </div>

              <core-form-input-number
                name="amount"
                class="uk-margin-bottom uk-margin-right amount"
                :label="$t('bookings.components.paymentsModal.amount')"
                :placeholder="$t('bookings.components.paymentsModal.amountPlaceholder', {
                  sign: values.currency,
                })"
                rules="required|between:0,1000000000"
                :currency="values.currency"
                :value="entity?.amount"
                float
              />

              <div class="uk-margin-bottom uk-margin-right">
                <label class="input-label --required" :class="{ '--invalid': errors.paymentType }" for="paymentType">
                  {{ $t('bookings.components.paymentsModal.paymentType') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="paymentType"
                    name="paymentType"
                    :label="$t('bookings.components.paymentsModal.paymentType')"
                    :class="{ '--invalid': errors.paymentType }"
                    rules="required"
                    :data="paymentTypes"
                    :value="entity?.paymentType"
                    :press-label="false"
                  />
                  <v-error-message class="input-error-message" name="paymentType" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label
                  class="input-label"
                  :class="{ '--invalid': errors.paymentDate }"
                  for="paymentDate"
                >
                  {{ $t('bookings.components.paymentsModal.paymentDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="paymentDate"
                    name="paymentDate"
                    :label="$t('bookings.components.paymentsModal.paymentDate')"
                    :value="entity ? formatDateForInput(entity.paymentDate) : defaultDate"
                  />
                  <v-error-message class="input-error-message" name="paymentDate" />
                </div>
              </div>
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.notes }" for="notes">
                {{ $t('bookings.components.paymentsModal.notes') }}
              </label>
              <div class="input-container">
                <v-field
                  id="notes"
                  class="uk-textarea --outline notes"
                  as="textarea"
                  name="notes"
                  :label="$t('bookings.components.paymentsModal.notes')"
                  :class="{ '--invalid': errors.notes }"
                  :value="entity?.notes"
                  v-e2e
                />
                <v-error-message class="input-error-message" name="notes" />
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                :disabled="loading"
              >
                {{ $t('bookings.components.paymentsModal.cancel') }}
              </button>
              <button
                @click="handleSubmitClick({ validate })"
                class="uk-button uk-button-primary"
                :disabled="loading"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('bookings.components.paymentsModal.save') }}
              </button>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from 'vee-validate';
// import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
import { PAYMENT_TYPES } from '@/modules/bookings/services/payments';
import { formatDateForInput } from '@/utils/intl';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    CoreFormInputNumber,
    CoreFormDatepicker,
  },
  setup() {
    // const route = useRoute();
    const store = useStore();
    const uikit = useKit();
    // const router = useRouter();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const paymentTypes = Object.values(PAYMENT_TYPES).map((type) => ({
      label: i18n.t(`bookings.dicts.paymentTypes.${type}`),
      value: type,
    }));

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);
    const formVisible = ref(false);

    const defaultDate = computed(() => formatDateForInput(new Date()));
    const booking = computed(() => store.state.bookings.entity);
    const entity = computed(() => store.state.bookings.payments.entity);
    const defaultCurrency = computed(() => {
      if (booking.value?.currency) {
        return booking.value.currency;
      }

      return store.state.account.account.settings.currency;
    });
    const currencies = computed(() => store.getters['core/currencies']);

    const onSubmit = async (values, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('bookings/payments/upsert', {
          bookingId: booking.value.id,
          data: values,
        });

        uikit.notify('success', i18n.t('bookings.components.paymentsModal.saveSuccess'));

        await store.dispatch('bookings/payments/setList', booking.value.id);
        await store.dispatch('bookings/refreshEntity', booking.value.id);

        uikit.modals.hideAll();
      } catch (err) {
        const errors = formErrorFormatter(err);

        if (Object.keys(errors).length) {
          setErrors(errors);
          scrollToFirstInvalidControl();
        } else {
          uikit.notify('danger', err.message);
        }
      }

      loading.value = false;
    };

    onMounted(() => {
      uikit.util.on(modalRef.value, 'beforeshow', () => {
        formVisible.value = true;
      }, { self: true });

      uikit.util.on(modalRef.value, 'hidden', () => {
        formVisible.value = false;

        store.commit('bookings/payments/SET_ENTITY', null);
      }, { self: true });
    });

    return {
      paymentTypes,
      currencies,
      formVisible,
      loading,
      modalRef,
      formRef,
      entity,
      defaultCurrency,
      defaultDate,

      onSubmit,
      handleSubmitClick,
      formatDateForInput,
    };
  },
};
</script>

<style lang="scss" scoped>
.heading {
  font-weight: 500;
  margin: 0;
  color: $base-color-darken;
}
.description {
  margin: 5px 0;
  color: rgba($base-color-darken, 0.7);
}
.uk-modal-dialog {
  width: inherit;
}
.modal-content {
  @include fromWideMobile {
    min-width: 580px;
  }
}
.row {
  @include fromWideMobile {
    display: flex;

    & > * {
      flex: 1;
    }
  }

  .amount {
    max-width: 120px;
  }
}

.notes {
  min-height: 60px;
}
</style>
