<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div v-if="visible">
          <h4 class="heading">{{ $t('rentals.components.photoModal.heading') }}</h4>
          <v-form
            ref="formRef"
            name="rentalPhoto"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.title }">
                  {{ $t('rentals.components.photoModal.title') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('rentals.components.photoModal.title')"
                    :placeholder="$t('rentals.components.photoModal.title')"
                    :class="{ '--invalid': errors.title }"
                    :value="entity?.title"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.description }">
                  {{ $t('rentals.components.photoModal.description') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-textarea --outline"
                    as="textarea"
                    name="description"
                    :label="$t('rentals.components.photoModal.description')"
                    :placeholder="$t('rentals.components.photoModal.description')"
                    :class="{ '--invalid': errors.description }"
                    :value="entity?.description"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="description" />
                </div>
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                v-e2e="'cancel-sales-channel'"
                :disabled="loading"
              >
                {{ $t('rentals.components.photoModal.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'sales-channel'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('rentals.components.photoModal.save') }}
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
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';

export default {
  name: 'RentalsRentalPhotoModal',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);
    const visible = ref(false);

    const entity = computed(() => store.state.rentals.images.entity);

    const onSubmit = async (payload, { setErrors }) => {
      const propertyId = route.params.id;
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('rentals/images/updateImage', {
          propertyId,
          id: entity.value.id,
          data: payload,
        });

        uikit.modals.hideAll();

        uikit.notify('success', i18n.t('rentals.components.photoModal.updateSuccess'));
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
      visible,
      loading,
      modalRef,
      formRef,
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
</style>
