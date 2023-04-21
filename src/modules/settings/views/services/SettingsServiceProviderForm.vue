<template>
  <v-form
    ref="formRef"
    @submit="onSubmit"
    class="uk-height-1-1 service-provider-form"
    name="serviceProvider"
    v-slot="{ errors, validate }"
    v-e2e
  >
    <core-layout-content :displayContent="true" :isLoading="loading">
      <template #header>
        <core-drawer-header>{{ $t('settings.components.serviceProviderForm.title') }}</core-drawer-header>
      </template>

      <template #default>
        <core-drawer-content>
          <div class="uk-padding-small uk-padding-remove-top">
            <div class="uk-margin-bottom">
              <label class="input-label --required" :class="{ '--invalid': errors.title }" for="nameServiceProvider">
                {{ $t('settings.components.serviceProviderForm.name') }}
              </label>
              <div class="input-container">
                <v-field
                  id="nameServiceProvider"
                  name="title"
                  as="input"
                  v-e2e
                  class="uk-input --outline"
                  :class="{ '--invalid': errors.title }"
                  :placeholder="$t('settings.components.serviceProviderForm.name')"
                  :label="$t('settings.components.serviceProviderForm.name')"
                  :value="serviceProvider?.name"
                  :rules="nameRules"
                />
                <v-error-message class="input-error-message" name="title" />
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
                  {{ $t('settings.components.serviceProviderForm.email') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="email"
                    name="email"
                    as="input"
                    type="email"
                    v-e2e="'email'"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.email }"
                    :placeholder="$t('settings.components.serviceProviderForm.email')"
                    :label="$t('settings.components.serviceProviderForm.email')"
                    :value="serviceProvider?.email"
                    rules="email"
                  />
                  <v-error-message class="input-error-message" name="email" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.phoneNumber }" for="phoneNumber">
                  {{ $t('settings.components.serviceProviderForm.phoneNumber') }}
                </label>
                <div class="input-container">
                  <core-form-phone-number
                    id="phoneNumber"
                    name="phoneNumber"
                    v-e2e
                    :placeholder="$t('settings.components.serviceProviderForm.phoneNumber')"
                    :label="$t('settings.components.serviceProviderForm.phoneNumber')"
                    :value="serviceProvider?.phoneNumber"
                  />
                  <v-error-message class="input-error-message" name="phoneNumber" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.companyName }" for="companyName">
                  {{ $t('settings.components.serviceProviderForm.companyName') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="companyName"
                    name="companyName"
                    as="input"
                    type="text"
                    v-e2e="'companyName'"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.companyName }"
                    :placeholder="$t('settings.components.serviceProviderForm.companyName')"
                    :label="$t('settings.components.serviceProviderForm.companyName')"
                    :value="serviceProvider?.companyName"
                    rules="required|min:1|max:191"
                  />
                  <v-error-message class="input-error-message" name="companyName" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.companyAddress }" for="companyAddress">
                  {{ $t('settings.components.serviceProviderForm.companyAddress') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="companyAddress"
                    name="companyAddress"
                    as="input"
                    v-e2e="'companyAddress'"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.companyAddress }"
                    :placeholder="$t('settings.components.serviceProviderForm.companyAddress')"
                    :label="$t('settings.components.serviceProviderForm.companyAddress')"
                    :value="serviceProvider?.companyAddress"
                    rules="max:191"
                  />
                  <v-error-message class="input-error-message" name="companyAddress" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.contactPerson }" for="contactPerson">
                  {{ $t('settings.components.serviceProviderForm.contactPerson') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="contactPerson"
                    name="contactPerson"
                    as="input"
                    type="text"
                    v-e2e="'contactPerson'"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.contactPerson }"
                    :placeholder="$t('settings.components.serviceProviderForm.contactPerson')"
                    :label="$t('settings.components.serviceProviderForm.contactPerson')"
                    :value="serviceProvider?.contactPerson"
                    rules="max:191"
                  />
                  <v-error-message class="input-error-message" name="contactPerson" />
                </div>
              </div>
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.description }" for="description">
                {{ $t('settings.components.serviceProviderForm.description') }}
              </label>
              <div class="input-container">
                <v-field
                  id="description"
                  name="description"
                  as="textarea"
                  v-e2e="'description'"
                  rows="4"
                  class="uk-textarea --outline"
                  :class="{ '--invalid': errors.description }"
                  :placeholder="$t('settings.components.serviceProviderForm.description')"
                  :label="$t('settings.components.serviceProviderForm.description')"
                  :value="serviceProvider?.description"
                />
                <v-error-message class="input-error-message" name="description" />
              </div>
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.notes }" for="notes">
                {{ $t('settings.components.serviceProviderForm.notes') }}
              </label>
              <div class="input-container">
                <v-field
                  id="notes"
                  name="notes"
                  as="textarea"
                  v-e2e="'notes'"
                  rows="4"
                  class="uk-textarea --outline"
                  :class="{ '--invalid': errors.notes }"
                  :placeholder="$t('settings.components.serviceProviderForm.notes')"
                  :label="$t('settings.components.serviceProviderForm.notes')"
                  :value="serviceProvider?.notes"
                />
                <v-error-message class="input-error-message" name="notes" />
              </div>
            </div>
          </div>
        </core-drawer-content>
      </template>

      <template #footer>
        <core-drawer-footer>
          <router-link
            v-if="redirect"
            v-e2e="'cancel-service-provider'"
            :to="{ name: 'settings-services' }"
            class="uk-margin-right"
          >
            {{ $t('settings.shared.cancel') }}
          </router-link>
          <button
            v-e2e="'service-provider'"
            type="submit"
            class="uk-button uk-button-success"
            @click="handleSubmitClick({ validate })"
          >{{ $t('settings.shared.save') }}</button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';

export default {
  props: {
    redirect: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormPhoneNumber,
  },
  emits: ['save'],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const uikit = useKit();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const formRef = ref(null);

    const serviceProvider = computed(() => store.state.settings.serviceProviders.entity);
    const loading = computed(() => store.state.settings.serviceProviders.entityLoading);
    const existedNames = computed(
      () => store.state.settings.serviceProviders
        .list
        .filter(({ id }) => !serviceProvider.value || serviceProvider.value.id !== id)
        .map(({ name }) => name),
    );

    const nameRules = computed(() => ({
      required: true,
      min: 2,
      max: 191,
      not_one_of: existedNames.value,
    }));

    const onSubmit = ({ title: name, ...values }, { setErrors }) => {
      store.commit('settings/serviceProviders/SET_FORM_LOADING', true);

      store.dispatch('settings/serviceProviders/upsert', { ...values, name })
        .then(() => store.dispatch('settings/serviceProviders/setList'))
        .then(() => props.redirect && router.push({ name: 'settings-services' }))
        .then(() => emit('save'))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl('.service-provider-form .--invalid');
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('settings/serviceProviders/SET_FORM_LOADING', false));
    };

    onMounted(() => {
      if (route.name === 'settings-service-providers-edit') {
        store.dispatch('settings/serviceProviders/setEntity', route.params.id);
      }
    });

    onUnmounted(() => {
      store.commit('settings/serviceProviders/SET_ENTITY', null);
    });

    return {
      formRef,
      serviceProvider,
      nameRules,
      loading,

      onSubmit,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.half-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}
</style>
