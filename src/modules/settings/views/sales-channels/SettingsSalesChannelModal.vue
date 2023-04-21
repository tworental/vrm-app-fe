<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div v-if="visible">
          <h4 class="heading">{{ $t('settings.views.salesChannelsModal.title') }}</h4>
          <v-form
            ref="formRef"
            name="salesChannels"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="grid uk-margin-top uk-margin-bottom">
              <div>
                <label class="input-label" :class="{ '--invalid': errors.title }">
                  {{ $t('settings.views.salesChannelsModal.name') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('settings.views.salesChannelsModal.name')"
                    :placeholder="$t('settings.views.salesChannelsModal.name')"
                    :class="{ '--invalid': errors.title }"
                    :rules="nameRules"
                    :value="entity?.name"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>

              <core-form-input-number
                name="commission"
                :placeholder="$t('settings.views.salesChannelsModal.commission')"
                :label="$t('settings.views.salesChannelsModal.commission')"
                rules="required|between:0,100"
                :value="entity?.commission"
                :min="0"
                :max="100"
                suffix="%"
                float
              />
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                v-e2e="'cancel-sales-channel'"
                :disabled="loading"
              >
                {{ $t('settings.views.salesChannelsModal.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'sales-channel'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('settings.views.salesChannelsModal.save') }}
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

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'SettingsSalesChannelModal',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormInputNumber,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);
    const visible = ref(false);

    const entity = computed(() => store.state.settings.salesChannels.entity);

    const existedNames = computed(
      () => store.getters['settings/salesChannels/uniqueNames'],
    );

    const nameRules = computed(() => ({
      required: true,
      max: 191,
      not_one_of: existedNames.value,
    }));

    const onSubmit = async ({ title: name, ...payload }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('settings/salesChannels/upsert', { ...payload, name });

        await store.dispatch('settings/salesChannels/setList');

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
        store.commit('settings/salesChannels/SET_ENTITY', null);
      });
    });

    return {
      visible,
      loading,
      modalRef,
      formRef,
      nameRules,
      entity,

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
.uk-modal-dialog {
  width: inherit;
}
.modal-content {
  @include fromWideMobile {
    min-width: 500px;
  }
}
.grid {
  display: grid;
  grid-gap: 20px;

  @include fromWideMobile {
    grid-template-columns: 3fr 1fr;
  }
}
</style>
