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
          <h5 class="card__title">{{ $t('rentals.components.rentalTypes.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('rentals.components.rentalTypes.description', { num: rentalTypes.length }) }}
        </p>
      </div>
      <div>
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add"
          @click="onAdd"
          v-e2e="'create-rental-type'"
          v-quota="{
            limits,
            name: LIMITS.APP_PROPERTIES_UNIT_TYPES_SIZE_LIMIT,
            value: rentalTypes.length,
            label: $t('core.limits.quotaExceeded')
          }"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span>{{ $t('rentals.components.rentalTypes.addType') }}</span>
        </button>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-small uk-table-divider table uk-margin-remove">
        <thead>
          <tr>
            <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.name') }}</th>
            <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.unitsNo') }}</th>
            <th class="table__heading uk-text-nowrap">{{ $t('rentals.shared.status') }}</th>
            <th class="table__heading uk-text-nowrap"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="(item) in rentalTypes" :key="item.id">
            <td class="table__cell uk-text-nowrap">
              {{ item.name }}
            </td>
            <td class="table__cell uk-text-nowrap">
              {{ item.unitsNo || '-' }}
            </td>
            <td class="table__cell uk-text-nowrap">
              <core-form-switcher
                :checked="item.isActive"
                @change="onToggleActive($event, {
                  id: item.id,
                  propertyId: rental.id,
                })"
              />
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
              <div class="actions">
                <template v-if="actionVisible === item.id">
                  <router-link
                    v-e2e="'edit-rental-type'"
                    :uk-tooltip="'title: ' + $t('rentals.shared.actions.edit')"
                    class="uk-button --icon table__action-btn animated-icon"
                    :to="{ name: 'rental-type-overview', params: { id: rental.id, rentalTypeId: item.id } }"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>

                  <button
                    @click="onDelete(rental?.id, item.id)"
                    :disabled="rentalTypes.length === 1"
                    v-e2e="'delete-rental-type'"
                    :uk-tooltip="'title: ' + $t('rentals.shared.actions.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-else
                  v-e2e="'actions-rental-type'"
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
    <rentals-rental-type-create ref="modalRef" />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import { LIMITS } from '@/utils/acl';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import { BOOKINGS_ATTACHED_ERROR } from '@/modules/rentals/services';
import RentalsRentalTypeCreate from './RentalsRentalTypeCreate.vue';

export default {
  name: 'RentalsRentalTypes',
  components: {
    CoreFormSwitcher,
    RentalsRentalTypeCreate,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const createMode = ref(false);
    const modalRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const limits = computed(() => store.state.core.limits);
    const rental = computed(() => store.state.rentals.rentals.entity);
    const rentalTypes = computed(() => store.state.rentals.rentalTypes.list);

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);

    const onDelete = (propertyId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.components.rentalTypes.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/rentalTypes/deleteRentalType', { propertyId, id })
        .then(() => uikit.notify('success', i18n.t('rentals.components.rentalTypes.deleteSuccess')))
        .then(() => store.dispatch('rentals/rentalTypes/setRentalTypes', propertyId))
        .finally(() => dialog.hide()))
      .catch((error) => {
        if (error) {
          if (error.code === BOOKINGS_ATTACHED_ERROR) {
            uikit.modals.warning(i18n.t('rentals.shared.deleteRentalTypeBookingsError'));
          } else {
            uikit.notify('danger', error.message);
          }
        }
      });

    const onToggleActive = (isActive, ids) => {
      store.dispatch('rentals/rentalTypes/updateRentalType', {
        isActive,
        ...ids,
      });
    };

    return {
      LIMITS,
      limits,
      createMode,
      modalRef,
      actionVisible,
      loading,
      rental,
      rentalTypes,

      onAdd,
      onDelete,
      onToggleActive,
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
</style>
