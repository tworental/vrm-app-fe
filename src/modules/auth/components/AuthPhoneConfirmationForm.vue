<template>
  <div>
    <v-form
      name="confirmPhoneNumber"
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
        <h2 class="title uk-margin-remove">{{ $t('auth.views.phoneVerification.confirm.title') }}</h2>
      </div>
      <p class="description">{{ $t('auth.views.phoneVerification.confirm.description') }}</p>
      <p class="uk-margin-remove-top uk-margin-small-bottom phone-wrap">
        <span class="phone">{{ data.phoneNumber }}</span>
        (<button
          type="button"
          class="uk-button uk-button-link"
          v-e2e="'change'"
          @click="$emit('cancel')"
        >{{ $t('auth.views.phoneVerification.confirm.change') }}
        </button>)
      </p>

      <div class="uk-flex uk-flex-bottom">
        <div class="uk-width-1-1 uk-margin-right">
          <label class="input-label" :class="{ '--invalid': errors.code }" for="code">
            {{ $t('auth.views.phoneVerification.confirm.code') }}
          </label>
          <div class="input-container">
            <v-field
              id="code"
              class="uk-input --outline"
              as="input"
              type="text"
              name="code"
              :label="$t('auth.views.phoneVerification.confirm.code')"
              :class="{ '--invalid': errors.code }"
              rules="required|min:4|max:4"
              v-e2e
            />
            <div class="input-suffix uk-position-center-right time">
              <core-countdown
                :time="data.expiresAt"
                @end="onTimeExpired"
              />
            </div>
            <v-error-message class="input-error-message" name="code" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="uk-button uk-button-success uk-text-nowrap"
            :disabled="loading"
            v-e2e
            @click="handleSubmitClick({ validate })"
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('auth.views.phoneVerification.confirm.submit') }}
          </button>
        </div>
      </div>
    </v-form>

  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import CoreCountdown from '@/modules/core/components/CoreCountdown.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreCountdown,
  },
  props: {
    data: {
      type: Object,
    },
  },
  emits: ['cancel'],
  setup(props, { emit }) {
    const uikit = useKit();
    const store = useStore();
    const i18n = useI18n();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);

    const onSubmit = (values) => {
      loading.value = true;

      store.dispatch('auth/confirmPhoneVerification', {
        ...values,
        phoneNumber: props.data.phoneNumber,
        token: props.data.token,
      })
        .then(() => uikit.notify('success', i18n.t('auth.components.phoneConfirmationForm.success')))
        .then(() => { window.top.location.href = '/'; })
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = false; });
    };

    const onTimeExpired = () => {
      emit('cancel');
      uikit.notify('warning', i18n.t('auth.components.phoneConfirmationForm.timeEnded'));
    };

    return {
      user,
      loading,

      handleSubmitClick,
      onSubmit,
      onTimeExpired,
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
  margin: 0;
  color: rgba($base-color-darken, 0.7);
}
.phone {
  font-weight: 500;
  margin: 0 0 20px;

  &-wrap {
    &,
    .uk-button-link {
      font-size: 0.75rem;
    }
  }
}
.time {
  color: rgba($base-color-darken, 0.7);
  padding-right: 10px;
}
</style>
