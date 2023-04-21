<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header
        :title="$t('rentals.views.seasonRates.title')"
        icon="rates"
        class="uk-flex-wrap"
      >
        <div class="uk-margin-auto-left">
          <rentals-season-rate-switcher
            value="active"
            @change="onSwitch"
          />
        </div>

        <rentals-breadcrumb :title="$t('rentals.views.seasonRates.title')" />
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <div class="card">
          <div class="card__header">
            <div>
              <p class="card__description">
                {{ $t('rentals.views.seasonRates.description.1') }}
              </p>
              <p class="card__description">
                {{ $t('rentals.views.seasonRates.description.2') }}
              </p>
            </div>
            <div>
              <button
                v-can:properties.write="user"
                type="button"
                class="uk-button uk-button-primary uk-button--add uk-text-nowrap"
                @click="onAdd"
                v-e2e="'create-rental-season-rate'"
              >
                <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
                <span>{{ $t('rentals.views.seasonRates.addSeasons') }}</span>
              </button>
            </div>
          </div>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
              <thead>
                <tr>
                  <th class="table__heading --filled --bordered --name">{{ $t('rentals.shared.season') }}</th>
                  <th class="table__heading --filled --bordered">{{ $t('rentals.shared.startDate') }}</th>
                  <th class="table__heading --filled --bordered">{{ $t('rentals.shared.endDate') }}</th>
                  <th class="table__heading --filled --bordered">{{ $t('rentals.shared.status') }}</th>
                  <th class="table__heading table__heading--actions --filled --bordered">
                    {{ $t('rentals.shared.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="table__row" v-for="(item) in seasonRates" :key="item.id">
                  <td class="table__cell">
                    {{ item.name }}
                  </td>
                  <td class="table__cell">
                    {{ formatDate(item.startDate, locale, undefined, dateFormat, false) || '-' }}
                  </td>
                  <td class="table__cell">
                    {{ formatDate(item.endDate, locale, undefined, dateFormat, false) || '-' }}
                  </td>
                  <td class="table__cell">
                    <span class="uk-badge badge--success" v-if="item.isCompleted">
                      {{ $t('rentals.dicts.seasonRateStatuses.completed') }}
                    </span>
                    <span class="uk-badge badge--light" v-else>
                      {{ $t('rentals.dicts.seasonRateStatuses.notCompleted') }}
                    </span>
                  </td>
                  <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
                    <div class="actions">
                      <template v-if="actionVisible === item.id">
                        <router-link
                          v-if="!$route.params.rentalTypeId"
                          v-e2e="'edit-rental-rate'"
                          :uk-tooltip="'title: ' + $t('rentals.shared.actions.edit')"
                          class="uk-button --icon table__action-btn animated-icon"
                          v-can:properties.write="user"
                          :to="{
                            name: 'rental-season-rate-overview',
                            params: {
                              id: $route.params.id,
                              rateId: item.id,
                            }
                          }"
                        >
                          <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                        </router-link>
                        <router-link
                          v-else
                          v-e2e="'edit-rental-rate'"
                          :uk-tooltip="'title: ' + $t('rentals.shared.actions.edit')"
                          class="uk-button --icon table__action-btn animated-icon"
                          v-can:properties.write="user"
                          :to="{
                            name: 'rental-type-season-rate-overview',
                            params: {
                              id: $route.params.id,
                              rentalTypeId: $route.params.rentalTypeId,
                              rateId: item.id,
                            }
                          }"
                        >
                          <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                        </router-link>

                        <button
                          v-can:properties.delete="user"
                          @click="onDelete($route.params.id, item.id)"
                          v-e2e="'delete-rental-rate'"
                          :uk-tooltip="'title: ' + $t('rentals.shared.actions.delete')"
                          class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                        >
                          <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                        </button>
                      </template>
                      <button
                        v-else
                        v-e2e="'actions-rental-rate'"
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
              <tfoot v-if="!seasonRates.length">
                <tr class="table__row --footer">
                  <td colspan="5" class="table__no-data">
                    {{ $t('rentals.views.seasonRates.noInfo') }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <rentals-season-rate-create ref="modalRef" />
    </template>
  </core-layout-content>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { formatDate } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import RentalsBreadcrumb from '../components/RentalsBreadcrumb.vue';
import RentalsSeasonRateCreate from '../components/rates/RentalsSeasonRateCreate.vue';
import RentalsSeasonRateSwitcher from '../components/rates/RentalsSeasonRateSwitcher.vue';

export default {
  components: {
    RentalsBreadcrumb,
    RentalsSeasonRateCreate,
    RentalsSeasonRateSwitcher,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const modalRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const seasonRates = computed(() => store.state.rentals.seasonRates.list);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const user = computed(() => store.state.account.user);

    const onSwitch = (filter) => {
      store.dispatch('rentals/seasonRates/setList', {
        filter,
        propertyId: store.state.rentals.rentals.entity.id,
        propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
      });
    };

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);

    const onDelete = (propertyId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.views.seasonRates.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/seasonRates/delete', {
        id,
        propertyId,
        propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
      })
        .then(() => store.dispatch('rentals/seasonRates/setList', {
          propertyId,
          propertyUnitTypeId: store.state.rentals.rentalTypes.entity.id,
        }))
        .then(() => uikit.notify('success', i18n.t('rentals.views.seasonRates.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      locale,
      timezone,
      modalRef,
      seasonRates,
      actionVisible,
      loading,
      dateFormat,
      user,

      onSwitch,
      onAdd,
      onDelete,
      formatDate,
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

  &__description {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    margin: 0;
  }
}
.--name {
  min-width: 250px;
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
}
.actions {
  width: 100px;
}
</style>
