<template>
  <div class="card" v-if="isAllowed">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cash-network.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.views.fees.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('settings.views.fees.description') }}
        </p>
      </div>
      <div>
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
          v-e2e="'create-fee'"
          v-can:fees.write="user"
          v-quota="{
            limits,
            name: LIMITS.APP_FEES_SIZE_LIMIT,
            value: fees.length,
            label: $t('core.limits.quotaExceeded')
          }"
          @click="$router.push({
            name: 'settings-fees-create'
          })"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-wide-mobile">{{ $t('settings.views.fees.create') }}</span>
        </button>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
        <tr>
          <th class="table__heading --filled --bordered --name-col">
            {{ $t('settings.views.fees.name') }}
          </th>
          <th class="table__heading --filled --bordered uk-text-center">
            {{ $t('settings.views.fees.fee') }}
          </th>
          <th class="table__heading --filled --bordered uk-text-center">
            {{ $t('settings.views.fees.frequency') }}
          </th>
          <th class="table__heading --filled --bordered uk-text-center">
            {{ $t('settings.views.fees.chargeType') }}
          </th>
          <th class="table__heading table__heading--actions --filled --bordered">
            {{ $t('settings.views.fees.action') }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr class="table__row" v-for="(item) in fees" :key="item.id">
          <td
            class="table__cell --name-col"
            :uk-tooltip="item.name.length > 50 ? 'pos: bottom;title: ' + item.name : 'title:'"
          >
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
            {{
              item.frequency
                ? $t('settings.dicts.frequencies.' + item.frequency)
                : '-'
            }}
          </td>
          <td class="table__cell uk-text-center">
            {{
              item.chargeType
                ? $t('settings.dicts.chargeTypes.' + item.chargeType)
                : '-'
            }}
          </td>
          <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
            <div class="actions">
              <template v-if="actionVisible === item.id">
                <router-link
                  :to="{ name: 'settings-fees-overview', params: { id: item.id } }"
                  v-e2e="'edit-fee'"
                  v-can:fees.write="user"
                  :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                  class="uk-button --icon table__action-btn animated-icon"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                </router-link>

                <button
                  @click="onDelete(item.id)"
                  v-e2e="'delete-fee'"
                  v-can:fees.delete="user"
                  :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                  class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                </button>
              </template>
              <button
                v-else
                v-e2e="'actions-fee'"
                v-can:fees.write.delete="user"
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
        <tfoot v-if="!fees.length">
        <tr class="table__row --footer">
          <td colspan="7" class="table__no-data">
            {{ $t('settings.views.fees.noInfo') }}
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

import { formatCurrency } from '@/utils/intl';
import { hasAccess, LIMITS, MODULES } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import { CALCULATION_TYPES } from '@/modules/settings/services/fees';

export default {
  name: 'SettingsFeesTable',
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const actionVisible = ref(null);
    const loading = ref(null);

    const fees = computed(() => store.state.settings.fees.list);
    const limits = computed(() => store.state.core.limits);
    const user = computed(() => store.state.account.user);
    const isAllowed = computed(() => hasAccess(limits.value, LIMITS.APP_FEES_ENABLED, user.value, MODULES.FEES));
    const locale = computed(() => store.state.account.account.settings.locale);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('settings.views.fees.deleteConfirm'))
      .then((dialog) => {
        loading.value = id;

        return store.dispatch('settings/fees/delete', id)
          .then(() => store.dispatch('settings/fees/setList'))
          .then(() => uikit.notify('success', i18n.t('settings.views.fees.deleteSuccess')))
          .finally(() => {
            loading.value = null;
            dialog.hide();
          });
      })
      .catch((error) => error && uikit.notify('danger', error.message));

    onMounted(() => {
      if (isAllowed.value) {
        store.dispatch('settings/fees/setList');
      }
    });

    return {
      LIMITS,
      CALCULATION_TYPES,
      fees,
      limits,
      actionVisible,
      loading,
      isAllowed,
      locale,
      user,

      onDelete,
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
    display: flex;
    justify-content: space-between;
    padding: 20px;
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
}
.--name-col {
  width: 300px;
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
