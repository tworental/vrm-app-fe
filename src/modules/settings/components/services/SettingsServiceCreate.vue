<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('settings.components.serviceCreate.title') }}</h4>
          <p class="description">{{ $t('settings.components.serviceCreate.description') }}</p>
          <v-form
            ref="formRef"
            name="service"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.title }">
                {{ $t('settings.components.serviceCreate.name') }}
              </label>
              <div class="input-container">
                <v-field
                  class="uk-input --outline"
                  as="input"
                  name="title"
                  :label="$t('settings.components.serviceCreate.name')"
                  :placeholder="$t('settings.components.serviceCreate.name')"
                  :class="{ '--invalid': errors.title }"
                  :rules="nameRules"
                  v-e2e
                />
                <v-error-message class="input-error-message" name="title" />
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                v-e2e="'cancel-service'"
                :disabled="loading"
              >
                {{ $t('settings.components.serviceCreate.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                v-e2e="'service'"
                @click="handleSubmitClick({ validate })"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('settings.components.serviceCreate.create') }}
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
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const router = useRouter();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);

    const existedNames = computed(
      () => store.state.settings.services.list
        .map(({ name }) => name),
    );

    const nameRules = computed(() => ({
      required: true,
      min: 2,
      max: 191,
      not_one_of: existedNames.value,
    }));

    const onSubmit = async ({ title: name }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        const { data: { id } } = await store.dispatch('settings/services/create', {
          name,
        });

        await router.push({ name: 'settings-services-overview', params: { id } });

        uikit.notify('success', i18n.t('settings.components.serviceCreate.saveSuccess'));

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
      uikit.util.on(modalRef.value, 'hidden', () => {
        if (formRef.value) {
          formRef.value.resetForm();
        }
      });
    });

    return {
      loading,
      modalRef,
      formRef,
      nameRules,

      onSubmit,
      handleSubmitClick,
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
      min-width: 500px;
    }
  }
</style>
