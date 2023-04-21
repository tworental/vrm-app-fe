<template>
  <v-form
    ref="formRef"
    class="sidebar-form"
    name="bookingService"
    @submit="onSubmit"
    v-slot="{ errors, values }"
    v-e2e
  >
    <h5 class="sidebar-form__title">{{ $t('bookings.components.serviceForm.title') }}</h5>
    <div class="uk-margin-bottom">
      <label class="input-label --required" :class="{ '--invalid': errors.propertyServiceId }">
        {{ $t('bookings.components.serviceForm.service') }}
      </label>
      <div class="input-container">
        <core-form-select
          name="propertyServiceId"
          :class="{ '--invalid': errors.propertyServiceId }"
          :search="true"
          :data="servicesToAutocomplete"
          rules="required"
          @update:modelValue="onSearch"
        />
        <v-error-message class="input-error-message" name="propertyServiceId" />
      </div>
    </div>
    <div class="uk-flex uk-flex-wrap">
      <template v-if="service?.type === TIMING_TYPES.EXACT_TIME">
        <div class="uk-margin-bottom service-date">
          <label
            class="input-label --required"
            :class="{ '--invalid': errors.startDate }"
            for="startDate"
          >
            {{ $t('bookings.components.serviceForm.startDate') }}
          </label>
          <div class="input-container">
            <core-form-datepicker
              id="startDate"
              name="startDate"
              :min="getMinDate(booking.dateArrival)"
              :max="getMaxDate(booking.dateDeparture)"
              :label="$t('bookings.components.serviceForm.startDate')"
              rules="required"
            />
            <v-error-message class="input-error-message" name="startDate" />
          </div>
        </div>
        <div class="uk-margin-bottom uk-margin-right">
          <label
            class="input-label"
            :class="{ '--invalid': errors.startTime }"
            for="startTime"
          >
            {{ $t('bookings.components.serviceForm.startTime') }}
          </label>
          <div class="input-container">
            <core-form-timepicker
              id="startTime"
              name="startTime"
              :label="$t('bookings.components.serviceForm.startTime')"
              :default-seconds="true"
            />
            <v-error-message class="input-error-message" name="startTime" />
          </div>
        </div>
      </template>
      <core-form-input-number
        v-if="service?.chargeType === CHARGE_TYPES.PER_NIGHT"
        class="uk-margin-bottom service-nights"
        :label="$t('bookings.components.serviceForm.quantity')"
        name="quantity"
        :value="values.quantity"
      />
    </div>

    <div class="uk-text-right">
      <button
        type="button"
        class="uk-button uk-button-link uk-margin-right"
        :disabled="loading"
        v-e2e="'cancel-service'"
        @click="$emit('close')"
      >
        {{ $t('bookings.shared.cancel') }}
      </button>
      <button
        class="uk-button uk-button-primary"
        v-e2e="'create-service'"
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('bookings.shared.save') }}
      </button>
    </div>
  </v-form>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ErrorMessage, Form } from 'vee-validate';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { formatDateForInput } from '@/utils/intl';
import { scrollToFirstInvalidControl } from '@/utils/form';
import dayjs from '@/utils/dayjs';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
import { DEFAULT_NIGHTS, EXTRAS_TYPES } from '@/modules/bookings/services/extras';
import { CHARGE_TYPES, FREQUENCIES } from '@/modules/settings/services/fees';
import { TIMING_TYPES } from '@/modules/settings/services/services';
import CoreFormTimepicker from '@/modules/core/components/core-form/CoreFormTimepicker.vue';
import { getNights } from '@/modules/bookings/utils/date';

export default {
  name: 'BookingsBookingServiceForm',
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    CoreFormInputNumber,
    CoreFormDatepicker,
    CoreFormTimepicker,
  },
  props: {
    bookingId: Number,
    propertyId: Number,
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const { formErrorFormatter } = useApiFormatters();

    const formRef = ref(null);
    const service = ref(null);
    const loading = ref(false);

    const defaultNights = computed(() => DEFAULT_NIGHTS);
    const booking = computed(() => store.state.bookings.entity);
    const services = computed(() => store.state.rentals.services.list);
    const servicesToAutocomplete = computed(() => store.state.rentals.services.list.map((entity) => ({
      label: entity.name,
      value: entity.id.toString(),
    })));
    const extra = computed(() => store.state.bookings.extras.entity);

    const onSearch = (id) => {
      if (id) {
        service.value = services.value.find((entity) => entity.id === Number(id));

        if (service.value) {
          formRef.value.setValues({
            ...service.value,
            propertyServiceId: id,
            quantity: service.value.chargeType === CHARGE_TYPES.PER_NIGHT
              ? getNights(booking.value.dateDeparture, booking.value.dateArrival)
              : defaultNights.value,
          });
        }
      } else {
        service.value = null;
        formRef.value.setFieldValue('quantity', defaultNights.value);
      }
    };

    const onSubmit = (values) => {
      loading.value = true;
      store.dispatch('bookings/extras/upsert', {
        bookingId: props.bookingId,
        data: {
          ...values,
          extrasType: EXTRAS_TYPES.SERVICE,
          quantity: values.quantity || defaultNights.value,
        },
      })
        .then(() => uikit.notify('success', i18n.t('bookings.components.serviceForm.success')))
        .then(() => Promise.all([
          store.dispatch('bookings/extras/setList', {
            bookingId: props.bookingId,
          }),
          store.dispatch('bookings/refreshEntity', props.bookingId),
        ]))
        .then(() => {
          emit('close');
          emit('save');
        })
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            formRef.value.setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => { loading.value = false; });
    };

    onMounted(async () => {
      await store.dispatch('rentals/services/setList', props.propertyId);

      if (extra.value) {
        formRef.value.setValues(extra.value);
      }
    });

    const getMinDate = (date) => formatDateForInput(dayjs(date).subtract(1, 'day'));
    const getMaxDate = (date) => formatDateForInput(dayjs(date).add(1, 'day'));

    return {
      CHARGE_TYPES,
      TIMING_TYPES,
      FREQUENCIES,
      formRef,
      services,
      servicesToAutocomplete,
      service,
      defaultNights,
      booking,
      loading,

      onSubmit,
      onSearch,
      getMinDate,
      getMaxDate,
    };
  },
};
</script>
