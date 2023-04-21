<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header
        :title="$t('rentals.views.units.title')"
        icon="bookmark"
        class="uk-flex-wrap"
      >
        <rentals-breadcrumb :title="$t('rentals.views.units.title')" />
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__heading uk-flex uk-flex-middle">
                <core-svg
                  :width="24"
                  :src="require('@/assets/images/icons/house-settings.svg')"
                  class="uk-margin-small-right"
                />
                <h5 class="card__title">{{ $t('rentals.views.units.table.title', { num: units.length }) }}</h5>
              </div>
              <p class="card__description">
                {{ $t('rentals.views.units.table.description') }}
                <span class="main-info">{{ rentalType.name }}</span>
              </p>
            </div>
            <div>
              <button
                type="button"
                class="uk-button uk-button-primary uk-button--add"
                @click="onAdd"
                v-e2e="'create'"
                v-can:properties.write="user"
                v-quota="{
                  limits,
                  name: LIMITS.APP_PROPERTIES_UNITS_SIZE_LIMIT,
                  value: units.length,
                  label: $t('core.limits.quotaExceeded')
                }"
              >
                <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
                <span>{{ $t('rentals.views.units.addUnit') }}</span>
              </button>
            </div>
          </div>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-small uk-table-divider table uk-margin-remove">
              <thead>
              <tr>
                <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.name') }}</th>
                <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.area') }}</th>
                <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.floor') }}</th>
                <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.status') }}</th>
                <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.isActive') }}</th>
                <th class="table__heading uk-text-nowrap"></th>
              </tr>
              </thead>
              <tbody>
              <tr class="table__row" v-for="(item) in units" :key="item.id">
                <td class="table__cell uk-text-nowrap">
                  <div class="uk-flex uk-flex-middle">
                    <div class="unit-color" :style="{ 'background-color': item.color }"></div>
                    <div>{{ item.name }}</div>
                  </div>
                </td>
                <td class="table__cell uk-text-nowrap">
                  {{ item.area || rentalType.area || '-' }}
                  {{ $t('core.dicts.units.'
                    + ((item.area || rentalType.area) && (item.areaUnit || rentalType.areaUnit) || 'blank') ) }}
                </td>
                <td class="table__cell uk-text-nowrap">
                  {{ item.floor || '-' }}
                </td>
                <td class="table__cell uk-text-nowrap">
                  <select
                    class="uk-select --outline status-select"
                    :value="item.status"
                    :class="[item.status]"
                    :disabled="!canUserEditProperty"
                    @change="onChangeStatus(
                      {
                        id: item.id,
                        propertyId: $route.params.id,
                        propertyUnitTypeId: $route.params.rentalTypeId,
                      },
                      $event.target.value
                    )"
                  >
                    <option v-for="status in STATUSES" :key="status" :value="status">
                      {{ $t('rentals.dicts.unitsStatuses.' + status) }}
                    </option>
                  </select>
                </td>
                <td class="table__cell uk-text-nowrap">
                  <core-form-switcher
                    :checked="Boolean(item.isActive)"
                    :disabled="!canUserEditProperty"
                    @change="onIsActiveToggle(
                      {
                        id: item.id,
                        propertyId: $route.params.id,
                        propertyUnitTypeId: $route.params.rentalTypeId,
                      },
                      $event
                    )"
                  />
                </td>
                <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
                  <div class="actions">
                    <template v-if="actionVisible === item.id">
                      <router-link
                        v-can:properties.write="user"
                        v-e2e="'edit-unit'"
                        :uk-tooltip="'title: ' + $t('rentals.shared.actions.edit')"
                        class="uk-button --icon table__action-btn animated-icon"
                        :to="{
                          name: 'rental-type-unit-overview',
                          params: {
                            id: $route.params.id,
                            rentalTypeId: $route.params.rentalTypeId,
                            rentalTypeUnitId: item.id,
                          }
                        }"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                      </router-link>

                      <button
                        v-can:properties.delete="user"
                        @click="onDelete($route.params.id, $route.params.rentalTypeId, item.id)"
                        :disabled="units.length === 1"
                        v-e2e="'delete-unit'"
                        :uk-tooltip="'title: ' + $t('rentals.shared.actions.delete')"
                        class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                      </button>
                    </template>
                    <button
                      v-can:properties.write.delete="user"
                      v-else
                      v-e2e="'actions-unit'"
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
            </table>
          </div>
        </div>
      </div>
      <rentals-rental-type-unit-create ref="modalRef" />
    </template>
  </core-layout-content>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import {
  ABILITIES,
  LIMITS,
  MODULES,
  can,
} from '@/utils/acl';
import { BOOKINGS_ATTACHED_ERROR, STATUSES } from '@/modules/rentals/services';
import useKit from '@/modules/core/composables/uikit';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import RentalsBreadcrumb from '../../../components/RentalsBreadcrumb.vue';
import RentalsRentalTypeUnitCreate from '../../../components/RentalsRentalTypeUnitCreate.vue';

export default {
  components: {
    CoreFormSwitcher,
    RentalsBreadcrumb,
    RentalsRentalTypeUnitCreate,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const modalRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const limits = computed(() => store.state.core.limits);
    const rentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const units = computed(() => store.state.rentals.units.list);
    const user = computed(() => store.state.account.user);
    const canUserEditProperty = computed(() => can(user.value, MODULES.PROPERTIES, [ABILITIES.WRITE]));

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);

    const onDelete = (propertyId, propertyUnitTypeId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.views.units.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/units/deleteUnit', { propertyId, propertyUnitTypeId, id })
        .then(() => uikit.notify('success', i18n.t('rentals.views.units.deleteSuccess')))
        .then(() => store.dispatch('rentals/units/setUnits', {
          propertyId,
          propertyUnitTypeId,
        }))
        .finally(() => dialog.hide()))
      .catch((error) => {
        if (error) {
          if (error.code === BOOKINGS_ATTACHED_ERROR) {
            uikit.modals.warning(i18n.t('rentals.shared.deleteUnitBookingsError'));
          } else {
            uikit.notify('danger', error.message);
          }
        }
      });

    const onChangeStatus = (ids, status) => {
      store.dispatch('rentals/units/updateUnit', {
        ...ids,
        status,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.units.statusUpdatedSuccess')));
    };

    const onIsActiveToggle = (ids, isActive) => {
      store.dispatch('rentals/units/updateUnit', {
        ...ids,
        isActive,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.units.isActiveUpdatedSuccess')));
    };

    return {
      LIMITS,
      STATUSES,
      limits,
      modalRef,
      actionVisible,
      loading,
      rentalType,
      units,
      user,
      canUserEditProperty,

      onAdd,
      onDelete,
      onChangeStatus,
      onIsActiveToggle,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
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
}
.actions {
  width: 100px;
}
.unit-color {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  margin-right: 8px;
}
.status-select {
  min-width: 106px;

  @include fromTablet {
    width: 50%;
  }
}
</style>
