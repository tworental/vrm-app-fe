<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div>
        <div>
          <h4 class="heading">{{ $t('storage.components.folderCreate.title') }}</h4>
          <v-form
            ref="formRef"
            name="folder"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top uk-margin-bottom">
              <label class="input-label --required" :class="{ '--invalid': errors.title }" for="nameFolder">
                {{ $t('storage.components.folderCreate.name') }}
              </label>
              <div class="input-container">
                <v-field
                  id="nameFolder"
                  class="uk-input --outline"
                  as="input"
                  name="title"
                  :label="$t('storage.components.folderCreate.name')"
                  :placeholder="$t('storage.components.folderCreate.name')"
                  :class="{ '--invalid': errors.title }"
                  rules="required|min:2|max:191"
                  v-e2e
                />
                <v-error-message class="input-error-message" name="title" />
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                :disabled="loading"
              >
                {{ $t('storage.components.folderCreate.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('storage.components.folderCreate.create') }}
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
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import useKit from '@/modules/core/composables/uikit';
import { handleSubmitClick } from '@/utils/form';

export default {
  name: 'StorageFolderCreate',
  props: {
    folderId: String,
  },
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup(props) {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);

    const nameRules = computed(() => ({
      required: true,
      min: 2,
      max: 191,
    }));

    const onSubmit = async ({ title: name }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('storage/createFolder', { name, folderId: props.folderId });

        uikit.notify('success', i18n.t('storage.components.folderCreate.successCreate'));

        uikit.modals.hideAll();
      } catch (err) {
        uikit.errorHandler(err)
          .catch(({ status, message }) => {
            if (status === 401) {
              window.location.reload();
            } else {
              uikit.notify('danger', message);
            }
          });
      } finally {
        loading.value = false;
        await store.dispatch('storage/getStorage', route.params);
      }
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

<style scoped>

</style>
