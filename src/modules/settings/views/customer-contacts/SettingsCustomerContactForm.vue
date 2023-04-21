<template>
  <v-form
    ref="formRef"
    @submit="onSubmit"
    class="uk-height-1-1 customer-contact-form"
    name="customerContact"
    v-slot="{ errors, validate }"
    v-e2e
  >
    <core-layout-content :displayContent="true" :isLoading="loading">
      <template #header>
        <core-drawer-header>{{ $t('settings.components.customerContactForm.title') }}</core-drawer-header>
      </template>

      <template #default>
        <core-drawer-content>
          <div class="uk-padding-small uk-padding-remove-top">
            <div class="uk-margin-bottom half-grid">
              <core-avatar-uploader
                name="avatar"
                class="avatar-contact"
                :photo-url="customerContact?.avatar || ''"
                v-e2e="'avatar'"
              />

              <div class="main-info">
                <div class="uk-margin-bottom">
                  <label class="input-label --required" :class="{ '--invalid': errors.firstName }" for="firstName">
                    {{ $t('settings.components.customerContactForm.firstName') }}
                  </label>
                  <div class="input-container">
                    <v-field
                      id="firstName"
                      name="firstName"
                      as="input"
                      type="text"
                      class="uk-input --outline"
                      :class="{ '--invalid': errors.firstName }"
                      :placeholder="$t('settings.components.customerContactForm.firstName')"
                      :label="$t('settings.components.customerContactForm.firstName')"
                      :value="customerContact?.firstName"
                      rules="required|max:191"
                    />
                    <v-error-message class="input-error-message" name="firstName" />
                  </div>
                </div>
                <div>
                  <label class="input-label --required" :class="{ '--invalid': errors.lastName }" for="lastName">
                    {{ $t('settings.components.customerContactForm.lastName') }}
                  </label>
                  <div class="input-container">
                    <v-field
                      id="lastName"
                      name="lastName"
                      as="input"
                      type="text"
                      class="uk-input --outline"
                      :class="{ '--invalid': errors.lastName }"
                      :placeholder="$t('settings.components.customerContactForm.lastName')"
                      :label="$t('settings.components.customerContactForm.lastName')"
                      :value="customerContact?.lastName"
                      rules="required|max:191"
                    />
                    <v-error-message class="input-error-message" name="lastName" />
                  </div>
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
                  {{ $t('settings.components.customerContactForm.email') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="email"
                    name="email"
                    as="input"
                    type="email"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.email }"
                    :placeholder="$t('settings.components.customerContactForm.email')"
                    :label="$t('settings.components.customerContactForm.email')"
                    :value="customerContact?.email"
                    rules="email"
                  />
                  <v-error-message class="input-error-message" name="email" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.parlance }" for="parlance">
                  {{ $t('settings.components.customerContactForm.parlance') }}
                </label>
                <div class="input-container">
                  <core-form-tags
                    id="parlance"
                    name="parlance"
                    :placeholder="$t('settings.components.customerContactForm.parlance')"
                    :only-autocomplete="true"
                    :data="langs"
                    :value="customerContact?.parlance"
                  />
                  <v-error-message class="input-error-message" name="parlance" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.primaryPhoneNumber }"
                  for="primaryPhoneNumber"
                >
                  {{ $t('settings.components.customerContactForm.primaryPhoneNumber') }}
                </label>
                <div class="input-container">
                  <core-form-phone-number
                    id="primaryPhoneNumber"
                    name="primaryPhoneNumber"
                    v-e2e
                    :placeholder="$t('settings.components.customerContactForm.primaryPhoneNumber')"
                    :label="$t('settings.components.customerContactForm.primaryPhoneNumber')"
                    :value="customerContact?.primaryPhoneNumber"
                  />
                  <v-error-message class="input-error-message" name="primaryPhoneNumber" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label
                  class="input-label"
                  :class="{ '--invalid': errors.additionalPhoneNumber }"
                  for="primaryPhoneNumber"
                >
                  {{ $t('settings.components.customerContactForm.additionalPhoneNumber') }}
                </label>
                <div class="input-container">
                  <core-form-phone-number
                    id="additionalPhoneNumber"
                    name="additionalPhoneNumber"
                    v-e2e
                    :placeholder="$t('settings.components.customerContactForm.additionalPhoneNumber')"
                    :label="$t('settings.components.customerContactForm.additionalPhoneNumber')"
                    :value="customerContact?.additionalPhoneNumber"
                    :required="false"
                  />
                  <v-error-message class="input-error-message" name="additionalPhoneNumber" />
                </div>
              </div>
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.bio }" for="bio">
                {{ $t('settings.components.customerContactForm.bio') }}
              </label>
              <div class="input-container">
                <v-field
                  id="bio"
                  name="bio"
                  as="textarea"
                  v-e2e
                  rows="4"
                  class="uk-textarea --outline"
                  :class="{ '--invalid': errors.bio }"
                  :placeholder="$t('settings.components.customerContactForm.bio')"
                  :label="$t('settings.components.customerContactForm.bio')"
                  :value="customerContact?.bio"
                />
                <v-error-message class="input-error-message" name="bio" />
              </div>
            </div>

            <div>
              <core-form-checkbox
                name="isDefault"
                :label="$t('settings.components.customerContactForm.isDefault')"
                :checked="Boolean(customerContact?.isDefault)"
              />
            </div>
          </div>
        </core-drawer-content>
      </template>

      <template #footer>
        <core-drawer-footer>
          <router-link
            v-e2e="'cancel-customer-contact'"
            :to="{ name: 'settings-customer-contacts' }"
            class="uk-margin-right"
          >
            {{ $t('settings.shared.cancel') }}
          </router-link>
          <button
            v-e2e="'customer-contact'"
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
import { useI18n } from 'vue-i18n';

import { LANG_ISO_CODES } from '@/utils/intl';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';
import CoreFormTags from '@/modules/core/components/core-form/CoreFormTags.vue';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreAvatarUploader from '@/modules/core/components/CoreAvatarUploader.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormPhoneNumber,
    CoreFormTags,
    CoreFormCheckbox,
    CoreAvatarUploader,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const uikit = useKit();
    const i18n = useI18n();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const langs = LANG_ISO_CODES.map((lang) => ({ label: i18n.t(`guests.dicts.langs.${lang}`), value: lang }));

    const formRef = ref(null);

    const customerContact = computed(() => store.state.settings.customerContacts.entity);
    const loading = computed(() => store.state.settings.customerContacts.entityLoading);

    const onSubmit = (values, { setErrors }) => {
      store.commit('settings/customerContacts/SET_FORM_LOADING', true);

      store.dispatch('settings/customerContacts/upsert', { data: values })
        .then(() => store.dispatch('settings/customerContacts/setList'))
        .then(() => router.push({ name: 'settings-customer-contacts' }))
        .then(() => uikit.notify('success', i18n.t('settings.components.customerContactForm.saveSuccess')))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl('.customer-contact-form .--invalid');
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('settings/customerContacts/SET_FORM_LOADING', false));
    };

    onMounted(() => {
      if (route.params.id) {
        store.dispatch('settings/customerContacts/setEntity', route.params.id);
      }
    });

    onUnmounted(() => {
      store.commit('settings/customerContacts/SET_ENTITY', null);
    });

    return {
      langs,
      formRef,
      customerContact,
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

  @include fromWideMobile {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
  }

  .main-info {
    margin-top: 20px;

    @include fromWideMobile {
      margin-top: 0;
    }
  }

  ::v-deep() .avatar-contact .preview {
    height: 137px;
  }
}
</style>
