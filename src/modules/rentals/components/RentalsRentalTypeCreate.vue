<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('rentals.components.createRentalType.title') }}</h4>
          <p class="description">{{ $t('rentals.components.createRentalType.description') }}</p>
          <v-form
            ref="formRef"
            class="uk-margin-top"
            name="rentalType"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="grid">
              <div>
                <label class="input-label" :class="{ '--invalid': errors.title }" for="rentalTypeName">
                  {{ $t('rentals.shared.name') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="rentalTypeName"
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('rentals.shared.nameLabel')"
                    :placeholder="$t('rentals.shared.namePlaceholder')"
                    :class="{ '--invalid': errors.title }"
                    rules="required|min:2|max:191"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>
              <core-form-input-number
                :label="$t('rentals.shared.unitsNo')"
                name="unitsNo"
                :placeholder="$t('rentals.shared.unitsNo')"
                :value="1"
                rules="required|between:1,100"
              />
            </div>
            <div class="uk-text-right uk-margin-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                :disabled="loading"
                v-e2e="'cancel-unit-type'"
              >
                {{ $t('rentals.components.createRentalType.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'unit-type'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('rentals.components.createRentalType.create') }}
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
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormInputNumber,
  },
  setup() {
    const i18n = useI18n();
    const route = useRoute();
    const store = useStore();
    const uikit = useKit();
    const router = useRouter();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);

    const onSubmit = async ({ title, unitsNo }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        const { data: { id } } = await store.dispatch('rentals/rentalTypes/createRentalType', {
          propertyId: route.params.id,
          name: title,
          unitsNo,
        });

        await store.dispatch('rentals/rentalTypes/setRentalTypes', route.params.id);

        await router.push({ name: 'rental-type-overview', params: { id: route.params.id, rentalTypeId: id } });

        uikit.notify('success', i18n.t('rentals.components.createRentalType.saveSuccess'));

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
  .grid {
    display: grid;
    grid-gap: 20px;

    @include fromWideMobile {
      grid-template-columns: 1fr 100px;
    }
  }
</style>
