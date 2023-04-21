<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cog-hand.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.components.servicesTable.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('settings.components.servicesTable.description') }}</p>
      </div>
      <div>
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
          @click="onAdd"
          v-e2e="'create-service'"
          v-can:services.write="loggedUser"
          v-quota="{
            limits,
            name: LIMITS.APP_SERVICES_SIZE_LIMIT,
            value: services.length,
            label: $t('core.limits.quotaExceeded')
          }"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-wide-mobile">
            {{ $t('settings.components.servicesTable.create') }}
          </span>
        </button>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr class="no-border">
            <th class="table__heading --filled --bordered --name-col">
              {{ $t('settings.components.servicesTable.name') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('settings.components.servicesTable.availability') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('settings.components.servicesTable.reminders') }}
            </th>
            <th class="table__heading --filled --bordered provider-column">
              {{ $t('settings.components.servicesTable.provider') }}
            </th>
            <th class="table__heading --bordered table__heading--actions --filled">
              {{ $t('settings.components.servicesTable.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
        <tr
          class="table__row"
          v-for="(item) in services"
          :key="item.id"
        >
          <td class="table__cell">
            <div class="--name">{{ item.name }}</div>
            <div class="meta-info" v-if="item.currency">
              {{
                $t('settings.components.servicesTable.perGuest', {
                  num: formatCurrency(item.amount, item.currency, locale)
                })
              }}
              -
              {{ $t('settings.dicts.chargeTypes.' + item.chargeType) }}
            </div>
          </td>
          <td class="table__cell">
            <span class="meta-info uk-flex uk-flex-middle uk-flex-center">
              <span class="uk-margin-small-right">
                <core-svg
                  v-if="TIMING_TYPES.EXACT_TIME === item.type"
                  width="16"
                  :src="require('@/assets/images/icons/mini/alarm.svg')"
                />
                <core-svg
                  v-if="TIMING_TYPES.ALL_STAY === item.type"
                  width="16"
                  :src="require('@/assets/images/icons/mini/calendar.svg')"
                />
              </span>
              <span>{{ item.type ? $t('settings.dicts.timing.' + item.type) : '-' }}</span>
            </span>
          </td>
          <td class="table__cell uk-text-center">
            <span class="meta-info">
              {{ item.totalReminders }}
            </span>
          </td>
          <td class="table__cell provider-column">
            <div class="meta-info">{{ item.serviceProviderName || '-' }}</div>
          </td>
          <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
            <div class="actions">
              <template v-if="actionVisible === item.id">
                <router-link
                  :to="{ name: 'settings-services-overview', params: { id: item.id } }"
                  v-e2e="'edit-service'"
                  v-can:services.write="loggedUser"
                  :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                  class="uk-button --icon table__action-btn animated-icon"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                </router-link>
                <button
                  v-can:services.delete="loggedUser"
                  @click="onDelete(item.id)"
                  v-e2e="'delete-service'"
                  :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                  class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                </button>
              </template>
              <button
                v-else
                v-e2e="'actions-service'"
                v-can:services.write.delete="loggedUser"
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
        <tfoot v-if="!services.length">
          <tr class="table__row --footer">
            <td colspan="7" class="table__no-data">
              {{ $t('settings.components.servicesTable.noInfo') }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <settings-service-create ref="modalRef" />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { formatCurrency } from '@/utils/intl';
import { LIMITS } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import { TIMING_TYPES } from '../../services/services';
import SettingsServiceCreate from './SettingsServiceCreate.vue';

export default {
  name: 'SettingsServicesTable',
  components: {
    SettingsServiceCreate,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const actionVisible = ref(null);
    const loading = ref(null);
    const modalRef = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const services = computed(() => store.state.settings.services.list);
    const limits = computed(() => store.state.core.limits);
    const locale = computed(() => store.state.account.account.settings.locale);

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('settings.components.servicesTable.deleteConfirm'))
      .then((dialog) => {
        loading.value = id;

        return store.dispatch('settings/services/delete', id)
          .then(() => store.dispatch('settings/services/setList'))
          .then(() => uikit.notify('success', i18n.t('settings.components.servicesTable.deleteSuccess')))
          .finally(() => {
            loading.value = null;
            dialog.hide();
          });
      })
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      LIMITS,
      TIMING_TYPES,
      loggedUser,
      limits,
      services,
      actionVisible,
      loading,
      modalRef,
      locale,

      onAdd,
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
    height: 75px;

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
.no-border {
  border: none !important;
}
.uk-button-primary {
  min-width: auto;
  white-space: nowrap;
}
.provider-column {
  padding-left: 40px;
}
.--name-col {
  width: 18%;
}
.--name {
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
