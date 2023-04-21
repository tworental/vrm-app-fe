<template>
  <v-form
    name="details"
    v-slot="{ errors, validate }"
    @submit="onSubmit"
    class="uk-position-relative"
    v-e2e
  >
    <div class="upload-grid uk-margin-bottom">
      <div>
        <core-avatar-uploader
          name="avatar"
          :photo-url="user?.avatar"
          v-e2e="'avatar'"
        />
      </div>
      <div>
        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors.firstName }" for="firstName">
            {{ $t('account.shared.firstName') }}
          </label>
          <div class="input-container">
            <v-field
              id="firstName"
              class="uk-input --outline"
              as="input"
              name="firstName"
              :label="$t('account.shared.firstName')"
              :class="{ '--invalid': errors.firstName }"
              rules="required|min:2|max:191"
              :value="user?.firstName"
              v-e2e
            />
            <v-error-message class="input-error-message" name="firstName" />
          </div>
        </div>

        <div>
          <label class="input-label --required" :class="{ '--invalid': errors.lastName }" for="lastName">
            {{ $t('account.shared.lastName') }}
          </label>
          <div class="input-container">
            <v-field
              id="lastName"
              class="uk-input --outline"
              as="input"
              name="lastName"
              :label="$t('account.shared.lastName')"
              :class="{ '--invalid': errors.lastName }"
              rules="required|min:2|max:191"
              :value="user?.lastName"
              v-e2e
            />
            <v-error-message class="input-error-message" name="lastName" />
          </div>
        </div>
      </div>
    </div>

    <div class="details-contact-grid">
      <div class="uk-margin-bottom">
        <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
          {{ $t('account.shared.email') }}
        </label>
        <div class="input-container">
          <v-field
            id="email"
            class="uk-input --outline"
            as="input"
            name="email"
            :label="$t('account.shared.email')"
            :class="{ '--invalid': errors.email }"
            rules="required|email"
            :value="user?.email"
            v-e2e
          />
          <v-error-message class="input-error-message" name="email" />
        </div>
      </div>

      <div class="uk-margin-bottom">
        <label class="input-label --required" :class="{ '--invalid': errors.phoneNumber }" for="phoneNumber">
          {{ $t('account.shared.phoneNumber') }}
        </label>
        <div class="input-container">
          <core-form-phone-number
            id="phoneNumber"
            name="phoneNumber"
            :label="$t('account.shared.phoneNumber')"
            :value="user?.phoneNumber"
            v-e2e
          />
          <v-error-message class="input-error-message" name="phoneNumber" />
        </div>
      </div>
    </div>
    <div class="uk-text-right">
      <button
        class="uk-button uk-button-success"
        type="submit"
        :disabled="loading || Object.keys(errors).length"
        v-e2e
        @click="handleSubmitClick({ validate })"
      >{{ $t('account.shared.btn.save') }}</button>
    </div>
    <div v-if="loading" class="uk-overlay-default uk-position-cover">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </v-form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreAvatarUploader from '@/modules/core/components/CoreAvatarUploader.vue';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreAvatarUploader,
    CoreFormPhoneNumber,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);

    const onSubmit = (values, { setErrors }) => {
      loading.value = true;

      return store.dispatch('account/updateUser', values)
        .then(() => uikit.notify('success', i18n.t('account.components.detailsForm.successUpdate')))
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
      user,
      loading,
      onSubmit,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-grid,
.details-contact-grid {
  display: grid;

  @include fromWideMobile {
    grid-gap: 20px;
  }
}
.upload-grid {
  @include fromWideMobile {
    grid-template-columns: 1fr 2fr;
  }
}
.details-contact-grid {
  @include fromWideMobile {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
