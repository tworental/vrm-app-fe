<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="uk-flex uk-flex-middle content">
        <core-svg
          class="--no-stroke placeholder --from-wide-mobile"
          height="250"
          :src="require('@/assets/images/placeholders/rentals-create.svg')"
        />
        <div>
          <h4 class="heading">{{ $t('rentals.views.create.title') }}</h4>
          <p class="description">{{ $t('rentals.views.create.description') }}</p>
          <v-form
            name="rental"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e
          >
            <div class="uk-margin-top uk-margin-bottom">
              <label class="input-label --required" :class="{ '--invalid': errors.title }" for="nameRentalCreate">
                {{ $t('rentals.shared.namePlaceholder') }}
              </label>
              <div class="input-container">
                <v-field
                  id="nameRentalCreate"
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
            <div
              class="form-group form-check"
              v-access="{
              limits, name: LIMITS.APP_PROPERTIES_UNIT_TYPES_ENABLED,
              user,
              acl: MODULES.PROPERTIES_UNIT_TYPES
            }"
            >
              <core-form-checkbox
                name="multipleUnitTypes"
                :label="$t('rentals.shared.multipleUnitTypes')"
                :tooltip="$t('rentals.views.create.tooltip')"
              />
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                :disabled="loading"
                v-e2e="'cancel'"
              >
                {{ $t('rentals.views.create.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('rentals.views.create.create') }}
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

import { LIMITS, MODULES } from '@/utils/acl';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormCheckbox,
  },
  setup() {
    const i18n = useI18n();
    const router = useRouter();
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);

    const onSubmit = async ({ title, multipleUnitTypes }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        const { id } = await store.dispatch('rentals/rentals/createRental', {
          multipleUnitTypes: Number(!!multipleUnitTypes),
          name: title,
        });

        await router.push({ name: 'rental-overview', params: { id } });

        uikit.notify('success', i18n.t('rentals.views.create.saveSuccess'));

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
      LIMITS,
      MODULES,
      modalRef,
      formRef,
      loading,
      user,
      limits,

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
  .content {
    @include fromWideMobile {
      padding: 0 30px;
    }
  }
  .placeholder {
    margin-right: 40px;
  }
  .uk-modal-dialog {
    width: inherit;
  }
</style>
