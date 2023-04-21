<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('settings.components.globalSeasonRateCreate.title') }}</h4>
          <p class="description">{{ $t('settings.components.globalSeasonRateCreate.description') }}</p>
          <v-form
            v-if="visible"
            ref="formRef"
            name="seasonRate"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top uk-margin-bottom">
              <div>
                <label class="input-label" :class="{ '--invalid': errors.title }">
                  {{ $t('settings.components.globalSeasonRateCreate.name') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('settings.components.globalSeasonRateCreate.name')"
                    :placeholder="$t('settings.components.globalSeasonRateCreate.name')"
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
                :disabled="loading"
                v-e2e="'cancel-season-rate'"
              >
                {{ $t('settings.components.globalSeasonRateCreate.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'season-rate'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('settings.components.globalSeasonRateCreate.create') }}
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
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { formatDateForInput } from '@/utils/intl';

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
    const visible = ref(false);

    const existedNames = computed(
      () => store.state.settings.seasonRates.list
        .map(({ name }) => name),
    );

    const ranges = computed(() => store.state.settings.seasonRates.list);

    const nameRules = computed(() => ({
      required: true,
      min: 2,
      max: 191,
      not_one_of: existedNames.value,
    }));

    const onSubmit = async ({ title: name, ...payload }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        const { data: { id } } = await store.dispatch('settings/seasonRates/create', { ...payload, name });

        await router.push({ name: 'settings-season-rates-overview', params: { rateId: id } });

        uikit.notify('success', i18n.t('settings.components.globalSeasonRateCreate.saveSuccess'));

        await store.dispatch('settings/seasonRates/setList');

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
      uikit.util.on(modalRef.value, 'show', () => {
        visible.value = true;
      });
      uikit.util.on(modalRef.value, 'hidden', () => {
        visible.value = false;
      });
    });

    return {
      loading,
      modalRef,
      formRef,
      nameRules,
      ranges,
      visible,

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
