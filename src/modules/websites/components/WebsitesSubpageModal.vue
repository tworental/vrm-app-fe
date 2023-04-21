<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div v-if="visible">
          <h4 class="heading">{{ $t('websites.components.subpageModal.heading') }}</h4>
          <v-form
            ref="formRef"
            name="subpage"
            @submit="onSubmit"
            v-slot="{ errors, validate }"
            v-e2e="'subpage'"
          >
            <div class="uk-margin-top">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.name }">
                  {{ $t('websites.components.subpageModal.name') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-input --outline"
                    as="input"
                    name="name"
                    :label="$t('websites.components.subpageModal.name')"
                    :placeholder="$t('websites.components.subpageModal.name')"
                    :class="{ '--invalid': errors.name }"
                    :rules="nameRules"
                    :value="entity?.name"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="name" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.title }">
                  {{ $t('websites.components.subpageModal.title') }}
                </label>
                <div class="input-container">
                  <v-field
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('websites.components.subpageModal.title')"
                    :placeholder="$t('websites.components.subpageModal.title')"
                    :class="{ '--invalid': errors.title }"
                    rules="max:191"
                    :value="entity?.title"
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
                v-e2e="'cancel-subpage'"
                :disabled="loading"
              >
                {{ $t('websites.components.subpageModal.cancel') }}
              </button>
              <button
                class="uk-button uk-button-primary"
                :disabled="loading"
                @click="handleSubmitClick({ validate })"
                v-e2e="'subpage'"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('websites.components.subpageModal.save') }}
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

export default {
  name: 'WebsitesSubpageModal',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);
    const visible = ref(false);

    const website = computed(() => store.state.websites.entity);
    const entity = computed(() => store.state.websites.pages.entity);

    const existedNames = computed(
      () => store.getters['websites/pages/uniqueNames'],
    );

    const nameRules = computed(() => ({
      required: true,
      max: 191,
      not_one_of: existedNames.value,
    }));

    const onSubmit = async (payload, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        await store.dispatch('websites/pages/upsert', {
          websiteId: website.value.id,
          data: payload,
        });

        await store.dispatch('websites/pages/setList', website.value.id);

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
        store.commit('websites/pages/SET_ENTITY', null);
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
