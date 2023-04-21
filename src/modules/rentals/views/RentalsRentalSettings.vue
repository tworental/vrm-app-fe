<template>
  <div
    class="uk-height-1-1"
  >
    <core-layout-content>
      <template #header>
        <core-layout-content-header
          :title="$t('rentals.views.settings.title')"
          icon="settings"
          class="uk-flex-wrap"
        >
          <rentals-breadcrumb :title="$t('rentals.views.settings.title')" />
        </core-layout-content-header>
      </template>
      <template #default>
        <div class="content">
          <rentals-rental-settings-info
             class="uk-margin-bottom"
             :errors="errors"
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
import RentalsRentalSettingsInfo from '../components/RentalsRentalSettingsInfo.vue';

export default {
  components: {
    RentalsBreadcrumb,
    RentalsRentalSettingsInfo,
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
    const user = computed(() => store.state.account.user);

    const onSubmit = handleSubmit((values) => {
      loading.value = true;

      store.dispatch('rentals/rentals/updateRental', {
        id: rental.value.id,
        ...values,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.settings.successUpdate')))
        .then(() => store.dispatch('rentals/rentals/setRental', rental.value.id))
        .then(() => resetForm({ values: formValues, dirty: false }))
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
      loading,
      values: formValues,
      errors: formErrors,
      user,

      onSubmit,
      handleSubmitClick,
      validate,
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
