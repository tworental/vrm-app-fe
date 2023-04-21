<template>
  <div class="uk-height-1-1">
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('rentals.views.location.title')"
          icon="location"
          class="uk-flex-wrap"
        >
          <rentals-breadcrumb :title="$t('rentals.views.location.title')" />
        </core-layout-content-header>
      </template>
      <template #default>
        <div class="content">
          <rentals-location-address
            class="uk-margin-bottom"
            :errors="errors"
            :form-values="values"
            @setBaseValues="setBaseValues"
            @setValues="setValues({ ...values, ...$event })"
          />
          <rentals-location-distances
            class="uk-margin-bottom"
            :errors="errors"
            :form-values="values"
          />
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
            v-e2e
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
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { showModalForDirtyForm } from '@/utils/modal';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import RentalsBreadcrumb from '../components/RentalsBreadcrumb.vue';
import RentalsLocationAddress from '../components/RentalsLocationAddress.vue';
import RentalsLocationDistances from '../components/RentalsLocationDistances.vue';

export default {
  components: {
    RentalsBreadcrumb,
    RentalsLocationAddress,
    RentalsLocationDistances,
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
      setValues,
      resetForm,
    } = useForm();

    const loading = ref(false);

    const rental = computed(() => store.state.rentals.rentals.entity);
    const user = computed(() => store.state.account.user);

    const onSubmit = handleSubmit((values) => {
      const payload = { ...values };

      if (!payload.address) {
        delete payload.address;
      }

      if (!payload.coordinates || (payload.coordinates.lat == null && payload.coordinates.lng == null)) {
        delete payload.coordinates;
      }

      loading.value = true;
      store.dispatch('rentals/rentals/updateRental', {
        id: rental.value.id,
        ...payload,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.location.successUpdate')))
        .then(() => resetForm({ values: formValues, dirty: false }))
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
      values: formValues,
      errors: formErrors,
      rental,
      loading,
      user,

      validate,
      onSubmit,
      setValues,
      setBaseValues,
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
