<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('websites.components.create.title') }}</h4>
          <p class="description">{{ $t('websites.components.create.description') }}</p>
          <v-form
            v-if="formVisible"
            ref="formRef"
            name="website"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top uk-margin-bottom">
              <div>
                <label class="input-label" :class="{ '--invalid': errors.title }">
                  {{ $t('websites.components.create.name') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('websites.components.create.name')"
                    :placeholder="$t('websites.components.create.name')"
                    :class="{ '--invalid': errors.title }"
                    :rules="nameRules"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                v-e2e="'cancel-website'"
                :disabled="loading"
              >
                {{ $t('websites.components.create.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'website'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('websites.components.create.create') }}
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
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { formatDateForInput } from '@/utils/intl';

export default {
  name: 'WebsitesCreate',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);
    const formVisible = ref(false);

    const existedNames = computed(
      () => store.state.websites.list
        .map(({ name }) => name),
    );

    const nameRules = computed(() => ({
      required: true,
      max: 191,
      not_one_of: existedNames.value,
    }));

    const onSubmit = async ({ title: name }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('websites/create', { name });

        uikit.notify('success', i18n.t('websites.components.create.saveSuccess'));

        await store.dispatch('websites/setList');

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
      });

      uikit.util.on(modalRef.value, 'hidden', () => {
        formVisible.value = false;
      });
    });

    return {
      loading,
      modalRef,
      formRef,
      nameRules,
      formVisible,

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
    min-width: 500px;
  }
}
</style>
