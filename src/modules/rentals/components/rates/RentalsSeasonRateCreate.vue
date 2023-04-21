<template>
  <div ref="modalRef" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
      <div class="modal-content">
        <div>
          <h4 class="heading">{{ $t('rentals.components.createSeasonRate.title') }}</h4>
          <p class="description">{{ $t('rentals.components.createSeasonRate.description') }}</p>
          <v-form
            v-if="formVisible"
            ref="formRef"
            name="seasonRate"
            @submit="onSubmit"
            v-slot="{ errors, validate, values }"
            v-e2e
          >
            <div class="half-grid uk-margin-top uk-margin-bottom">
              <div>
                <label for="seasonName" class="input-label --required" :class="{ '--invalid': errors.title }">
                  {{ $t('rentals.components.createSeasonRate.seasonName') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="seasonName"
                    class="uk-input --outline"
                    as="input"
                    name="title"
                    :label="$t('rentals.components.createSeasonRate.seasonName')"
                    :placeholder="$t('rentals.components.createSeasonRate.seasonName')"
                    :class="{ '--invalid': errors.title }"
                    rules="required|min:2|max:191"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>
              <core-form-date-range
                :form-values="values"
                :errors="errors"
                :ranges="ranges"
              />
            </div>

            <div class="grid uk-margin-bottom" v-if="rates.length">
              <div class="rate">
                <label class="input-label" :class="{ '--invalid': errors.rateSeasonId }" for="rateSeasonId">
                  {{ $t('rentals.components.createSeasonRate.rate') }}
                  <span
                    class="question-tooltip"
                    uk-icon="icon: question; ratio: 0.5"
                    :uk-tooltip="'title:' + $t('rentals.components.createSeasonRate.rateTooltip')"
                  ></span>
                </label>
                <div class="input-container">
                  <core-form-select
                    id="rateSeasonId"
                    name="rateSeasonId"
                    :class="{ '--invalid': errors.rateSeasonId }"
                    :label="$t('rentals.components.createSeasonRate.rate')"
                    :data="rates"
                    :value="values.rateSeasonId"
                  />
                  <v-error-message class="input-error-message" name="rateSeasonId" />
                </div>
              </div>
            </div>

            <div class="uk-text-right uk-margin-small-top">
              <button
                type="button"
                class="uk-button uk-button-link uk-margin-right uk-modal-close"
                :disabled="loading"
                v-e2e="'cancel'"
              >
                {{ $t('rentals.components.createSeasonRate.cancel') }}
              </button>
              <button
                @click="handleSubmitClick({ validate })"
                class="uk-button uk-button-primary"
                :disabled="loading"
              >
                <div v-if="loading" uk-spinner="ratio: 0.5"></div>
                {{ $t('rentals.components.createSeasonRate.create') }}
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
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormDateRange from '@/modules/core/components/core-form/CoreFormDateRange.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    CoreFormDateRange,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const uikit = useKit();
    const router = useRouter();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const modalRef = ref(false);
    const formRef = ref(false);
    const loading = ref(false);
    const formVisible = ref(false);

    const rates = computed(() => store.state.settings.seasonRates.list.map((rate) => ({
      label: rate.name,
      value: rate.id,
    })));

    const ranges = computed(() => store.state.rentals.seasonRates.list);

    const onSubmit = async ({
      title: name,
      startDate,
      endDate,
      rateSeasonId,
    }, { setErrors }) => {
      uikit.notification.closeAll(undefined, true);

      loading.value = true;

      try {
        const { data: { id } } = await store.dispatch('rentals/seasonRates/create', {
          propertyId: route.params.id,
          propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
          data: {
            propertyUnitTypeRateId: store.state.rentals.rentalTypes.rates.id,
            name,
            startDate,
            endDate,
            rateSeasonId: rateSeasonId || '',
          },
        });

        await store.dispatch('rentals/seasonRates/setList', {
          propertyId: route.params.id,
          propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
        });

        if (route.params.rentalTypeId) {
          await router.push({
            name: 'rental-type-season-rate-overview',
            params: {
              id: route.params.id,
              rentalTypeId: route.params.rentalTypeId,
              rateId: id,
            },
          });
        } else {
          await router.push({
            name: 'rental-season-rate-overview',
            params: {
              id: route.params.id,
              rateId: id,
            },
          });
        }

        uikit.notify('success', i18n.t('rentals.components.createSeasonRate.saveSuccess'));

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
      }, { self: true });

      uikit.util.on(modalRef.value, 'hidden', () => {
        formVisible.value = false;
      }, { self: true });
    });

    return {
      formVisible,
      loading,
      modalRef,
      formRef,
      rates,
      ranges,

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
      min-width: 580px;
    }
  }
  .grid {
    display: grid;
    grid-gap: 20px;

    @include fromWideMobile {
      grid-template-columns: 3fr 2fr 2fr;
    }
  }
  .half-grid {
    display: grid;
    grid-gap: 20px;

    @include fromWideMobile {
      grid-template-columns: 3fr 250px;
    }
  }
  .rate {
    grid-column-start: 1;
    grid-column-end: 3;
  }
</style>
