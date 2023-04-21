<template>
  <div class="card" v-if="isAllowed">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/house-tax.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('rentals.components.rentalTaxes.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('rentals.components.rentalTaxes.description') }}
        </p>
      </div>
      <div class="uk-flex uk-flex-top uk-flex-right search__wrapper">
        <core-form-select
          v-can:properties.write="user"
          name="fee"
          :data="dict"
          :placeholder="$t('rentals.components.rentalTaxes.search')"
          :search="true"
          class="search uk-width-1-1"
          :value="taxToAttach"
          @change="onAttach($route.params.id, $event)"
        />
        <router-link
          v-can:properties.write="user"
          :to="{ name: 'settings-taxes-create' }"
          class="uk-button uk-button-primary uk-button--add-from-tablet"
          v-e2e="'create'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-tablet">{{ $t('rentals.components.rentalTaxes.createTax') }}</span>
        </router-link>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr>
            <th class="table__heading --filled --bordered --name-col">
              {{ $t('rentals.components.rentalTaxes.name') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('rentals.components.rentalTaxes.tax') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('rentals.components.rentalTaxes.frequency') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('rentals.components.rentalTaxes.chargeType') }}
            </th>
            <th class="table__heading table__heading--actions --filled --bordered">
              {{ $t('rentals.components.rentalTaxes.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
        <tr class="table__row" v-for="(item) in taxes" :key="item.id">
          <td class="table__cell --name-col">
            {{ item.name }}
          </td>
          <td class="table__cell uk-text-center">
            <template v-if="item.rateType === CALCULATION_TYPES.FLAT_FEE">
              {{ formatCurrency(item.amount, item.currency, locale) }}
            </template>
            <template v-if="item.rateType === CALCULATION_TYPES.PERCENTAGE">
              {{ item.percentage }}%
            </template>
          </td>
          <td class="table__cell uk-text-center">
            {{ item.frequency ? $t('settings.dicts.frequencies.' + item.frequency) : '' }}
          </td>
          <td class="table__cell uk-text-center">
            {{ item.chargeType ? $t('settings.dicts.chargeTypes.' + item.chargeType) : '-' }}
          </td>
          <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
            <div class="actions">
              <template v-if="actionVisible === item.id">
                <button
                  @click="onDelete($route.params.id, item.id)"
                  v-e2e="'delete-rental-tax'"
                  :uk-tooltip="'title: ' + $t('rentals.shared.actions.delete')"
                  class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                </button>
              </template>
              <button
                v-else
                v-can:properties.delete="user"
                v-e2e="'actions-rental-tax'"
                @click="actionVisible = item.id"
                class="uk-button --icon table__action-dots"
              >
                <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
              </button>
              <div v-if="loading === item.id" class="loader table__action-loader" uk-spinner></div>
            </div>
          </td>
        </tr>
        </tbody>
        <tfoot v-if="!taxes.length">
          <tr class="table__row --footer">
            <td colspan="7" class="table__no-data">
              {{ $t('rentals.components.rentalTaxes.noInfo') }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { formatCurrency } from '@/utils/intl';
import { hasAccess, LIMITS, MODULES } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import { CALCULATION_TYPES } from '@/modules/settings/services/fees';

export default {
  components: {
    CoreFormSelect,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();
    const route = useRoute();

    const actionVisible = ref(null);
    const loading = ref(null);
    const taxToAttach = ref(null);

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);
    const isAllowed = computed(() => hasAccess(limits.value, LIMITS.APP_TAXES_ENABLED, user.value, MODULES.TAXES));
    const taxes = computed(() => store.state.rentals.taxes.list);
    const dict = computed(
      () => store.state.settings.taxes.list
        .filter((tax) => !taxes.value.map(({ taxId }) => taxId).includes(tax.id))
        .map((tax) => ({
          label: tax.name,
          value: tax.id,
        })),
    );
    const locale = computed(() => store.state.account.account.settings.locale);

    const onDelete = (propertyId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.components.rentalTaxes.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/taxes/delete', { propertyId, id })
        .then(() => store.dispatch('rentals/taxes/setList', propertyId))
        .then(() => uikit.notify('success', i18n.t('rentals.components.rentalTaxes.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onAttach = (propertyId, event) => {
      if (!event.target.value) return;

      taxToAttach.value = event.target.value;

      store.dispatch('rentals/taxes/create', { propertyId, taxId: taxToAttach.value })
        .then(() => store.dispatch('rentals/taxes/setList', propertyId))
        .then(() => uikit.notify('success', i18n.t('rentals.components.rentalTaxes.attachSuccess')))
        .then(() => { taxToAttach.value = null; })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    onMounted(() => {
      if (isAllowed.value) {
        store.dispatch('rentals/taxes/setList', route.params.id);
        store.dispatch('settings/taxes/setList');
      }
    });

    return {
      CALCULATION_TYPES,
      taxes,
      dict,
      actionVisible,
      loading,
      taxToAttach,
      isAllowed,
      locale,
      user,

      onDelete,
      onAttach,
      formatCurrency,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;

  &__header {
    padding: 20px;

    @include mediaFrom(760px) {
      display: flex;
      justify-content: space-between;
    }
  }

  &__heading {
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 700;
    color: $base-color-darken;
    margin: 0;
  }

  &__description {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    margin: 0;
  }
}
.description {
  min-height: 100px;
}
.table {
  margin: -20px;

  &__row {
    height: 58px;

    &:last-child {
      border-bottom: none !important;
    }
  }

  &__heading {
    padding-top: 10px;
    padding-bottom: 10px;

    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }

  &__heading,
  &__cell {
    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }
  &__cell {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.actions {
  width: 100px;
}
.uk-button-primary {
  min-width: auto;
  white-space: nowrap;

  @include mediaTo(760px) {
    position: absolute;
    top: 20px;
    right: 20px;
    padding-left: 12px;
    padding-right: 12px;

    ::v-deep() svg {
      margin-right: 0;
    }
  }
}
.search {
  margin-top: 20px;

  @include mediaFrom(760px) {
    margin-top: 0;
    margin-right: 20px;
    max-width: 320px;

    &__wrapper {
      width: 60%;
    }
  }
}
.--name-col {
  width: 26%;
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
