<template>
  <div uk-modal ref="modalRef">
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('rentals.components.createRentalTypeUnit.title') }}</h4>
          <p class="description">{{ $t('rentals.components.createRentalTypeUnit.description') }}</p>
          <v-form
            ref="formRef"
            name="rentalTypeUnit"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top uk-margin-bottom">
              <div class="input-container">
                <v-field
                  class="uk-input --outline"
                  as="input"
                  name="title"
                  :label="$t('rentals.shared.nameLabel')"
                  :placeholder="$t('rentals.shared.namePlaceholder')"
                  :class="{ '--invalid': errors.title }"
                  rules="required|min:2|max:191"
                  v-e2e
                />
                <div class="uk-position-center-right uk-margin-small-right">
                  <v-field
                    class="color-input"
                    as="input"
                    name="color"
                    type="color"
                    :label="$t('rentals.shared.nameLabel')"
                    :placeholder="$t('rentals.shared.namePlaceholder')"
                    :class="{ '--invalid': errors.color }"
                    v-model="defaultColor"
                    v-e2e
                  />
                </div>
                <v-error-message class="input-error-message" name="title" />
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                v-e2e="'cancel-unit'"
                :disabled="loading"
              >
                {{ $t('rentals.components.createRentalTypeUnit.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'unit'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('rentals.components.createRentalTypeUnit.create') }}
              </button>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import {
  Form,
  Field,
  ErrorMessage,
} from 'vee-validate';
import { useRoute } from 'vue-router';

import { getRandomColor } from '@/utils/color';
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
    const route = useRoute();
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const loading = ref(false);
    const modalRef = ref(null);
    const formRef = ref(null);
    const defaultColor = ref('#ffffff');

    const onSubmit = async ({ title, color }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('rentals/units/createUnit', {
          propertyId: route.params.id,
          propertyUnitTypeId: route.params.rentalTypeId,
          name: title,
          color,
        });

        await store.dispatch('rentals/units/setUnits', {
          propertyId: route.params.id,
          propertyUnitTypeId: route.params.rentalTypeId,
        });

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
        defaultColor.value = getRandomColor();
      });

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
      defaultColor,

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
  .form-check {
    position: relative;
    color: rgba($base-color-darken, 0.7);
  }
  .tooltip {
    position: absolute;
    top: -1px;
    cursor: pointer;
    margin-left: 5px;
  }
  .placeholder {
    margin-right: 40px;
  }
  .uk-modal-dialog {
    width: inherit;
  }
  .modal-content {
    @include fromWideMobile {
      min-width: 500px;
    }
  }
  .color-input {
    height: 20px;
    width: 20px;
    border: none;
  }
</style>
