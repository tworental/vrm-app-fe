<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/house-settings.svg')"
            class="uk-margin-small-right"
          />
          <h5 class="card__title">{{ $t('rentals.components.services.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('rentals.components.services.description') }}
        </p>
      </div>
      <div class="uk-flex uk-flex-top uk-flex-right search__wrapper">
        <core-form-select
          v-can:properties.write="user"
          name="service"
          :data="dict"
          :placeholder="$t('rentals.components.services.search')"
          class="search uk-width-1-1"
          :search="true"
          :value="serviceToAttach"
          @change="onAttach($route.params.id, $event)"
        />
        <button
          v-can:properties.write="user"
          type="button"
          class="uk-button uk-button-primary uk-button--add-from-tablet"
          @click="onAddService"
          v-e2e="'create'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-tablet">{{ $t('rentals.components.services.createServices') }}</span>
        </button>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr class="no-border">
            <th class="table__heading --filled --bordered --name-col">
              {{ $t('rentals.components.services.name') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('rentals.components.services.availability') }}
            </th>
            <th class="table__heading --filled --bordered uk-text-center">
              {{ $t('rentals.components.services.reminders') }}
            </th>
            <th class="table__heading --filled --bordered provider-column">
              {{ $t('rentals.components.services.provider') }}
            </th>
            <th class="table__heading --bordered table__heading--actions --filled">
              {{ $t('rentals.components.services.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
        <tr class="table__row" v-for="(item) in services" :key="item.id">
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
            {{ item.totalReminders }}
          </td>
          <td class="table__cell provider-column">
            <div class="meta-info">
              {{ item.serviceProviderName || '-' }}
            </div>
          </td>
          <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
            <div class="actions">
              <template v-if="actionVisible === item.id">
                <button
                  v-can:properties.delete="user"
                  @click="onDelete($route.params.id, item.id)"
                  v-e2e="'delete-rental-service'"
                  :uk-tooltip="'title: ' + $t('rentals.shared.actions.delete')"
                  class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                >
                  <core-svg
                    :width="24"
                    :src="require('@/assets/images/icons/delete.svg')"
                  />
                </button>
              </template>
              <button
                v-else
                v-can:properties.delete="user"
                v-e2e="'actions-rental-service'"
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
              {{ $t('rentals.components.services.noInfo') }}
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

import useKit from '@/modules/core/composables/uikit';
import { formatCurrency } from '@/utils/intl';
import { TIMING_TYPES } from '@/modules/settings/services/services';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import SettingsServiceCreate from '@/modules/settings/components/services/SettingsServiceCreate.vue';

export default {
  components: {
    CoreFormSelect,
    SettingsServiceCreate,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const actionVisible = ref(null);
    const loading = ref(null);
    const modalRef = ref(null);
    const serviceToAttach = ref(null);

    const services = computed(() => store.state.rentals.services.list);
    const dict = computed(
      () => store.state.settings.services.list
        .filter((service) => !services.value.map(({ serviceId }) => serviceId).includes(service.id))
        .map((service) => ({
          label: service.name,
          value: service.id,
        })),
    );
    const locale = computed(() => store.state.account.account.settings.locale);
    const user = computed(() => store.state.account.user);

    const onAddService = () => uikit.modals.show(modalRef.value?.$el);

    const onDelete = (propertyId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.components.services.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/services/delete', { propertyId, id })
        .then(() => store.dispatch('rentals/services/setList', propertyId))
        .then(() => uikit.notify('success', i18n.t('rentals.components.services.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onAttach = (propertyId, event) => {
      if (!event.target.value) return;

      serviceToAttach.value = event.target.value;

      store.dispatch('rentals/services/create', { propertyId, serviceId: serviceToAttach.value })
        .then(() => store.dispatch('rentals/services/setList', propertyId))
        .then(() => uikit.notify('success', i18n.t('rentals.components.services.attachSuccess')))
        .then(() => { serviceToAttach.value = null; })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    return {
      services,
      dict,
      actionVisible,
      loading,
      modalRef,
      serviceToAttach,
      TIMING_TYPES,
      locale,
      user,

      onAddService,
      formatCurrency,
      onDelete,
      onAttach,
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
