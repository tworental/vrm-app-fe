<template>
  <div>
    <v-form
      name="verifyPhoneNumber"
      @submit="onSubmit"
      class="uk-height-1-1"
      v-slot="{ errors, validate }"
      v-e2e
    >
      <div class="uk-flex uk-flex-middle uk-margin-small-bottom">
        <div class="uk-margin-small-right">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/phone.svg')"
          />
        </div>
        <h2 class="title uk-margin-remove">{{ $t('auth.views.phoneVerification.verify.title') }}</h2>
      </div>

      <p class="description">{{ $t('auth.views.phoneVerification.verify.description') }}</p>

      <div class="uk-flex uk-flex-bottom">
        <div class="uk-margin-right uk-width-1-1">
          <label class="input-label" :class="{ '--invalid': errors.phoneNumber }" for="phoneNumber">
            {{ $t('auth.views.phoneVerification.verify.phoneNumber') }}
          </label>
          <div class="input-container">
            <core-form-phone-number
              id="phoneNumber"
              name="phoneNumber"
              :label="$t('auth.views.phoneVerification.verify.phoneNumber')"
              :value="user.phoneNumber"
              v-e2e
            />
            <v-error-message class="input-error-message" name="phoneNumber" />
          </div>
        </div>

        <div class="uk-flex-1">
          <button
            type="submit"
            class="uk-button uk-button-success uk-text-nowrap"
            :disabled="loading"
            v-e2e
            @click="handleSubmitClick({ validate })"
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('auth.views.phoneVerification.verify.submit') }}
          </button>
        </div>
      </div>
    </v-form>

  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Form } from 'vee-validate';

import useKit from '@/modules/core/composables/uikit';
import { handleSubmitClick } from '@/utils/form';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';

export default {
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormPhoneNumber,
  },
  emits: ['save'],
  setup(props, { emit }) {
    const uikit = useKit();
    const store = useStore();
    const loading = ref(false);

    const user = computed(() => store.state.account.user);

    const onSubmit = (values) => {
      loading.value = true;

      store.dispatch('auth/requestPhoneVerification', values)
        .then(({ data }) => emit('save', {
          phoneNumber: values.phoneNumber,
          token: data.token,
          expiresAt: data.expiresAt,
        }))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = false; });
    };

    return {
      user,
      loading,

      handleSubmitClick,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.25rem;
  margin: 0 0 10px;
  font-weight: 500;
}
.description {
  font-size: 0.75rem;
  margin: 0 0 20px;
  color: rgba($base-color-darken, 0.7);
}
</style>
