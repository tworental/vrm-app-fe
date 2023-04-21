<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.views.seasonRates.title')" icon="rates" />
    </template>

    <template #default>
      <div class="content">
        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__heading uk-flex uk-flex-middle">
                <core-svg
                  :width="24"
                  :src="require('@/assets/images/icons/rates.svg')"
                />
                <h5 class="uk-margin-small-left card__title">{{ $t('settings.views.seasonRates.title') }}</h5>
              </div>
              <p class="card__description">
                {{ $t('settings.views.seasonRates.description') }}
              </p>
            </div>
            <div>
              <button
                type="button"
                class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
                @click="onAdd"
                v-e2e="'create'"
                v-can:rateSeasons.write="user"
                v-quota="{
                  limits,
                  name: LIMITS.APP_RATE_SEASONS_SIZE_LIMIT,
                  value: rates.length,
                  label: $t('core.limits.quotaExceeded')
                }"
              >
                <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
                <span class="--from-wide-mobile">{{ $t('settings.views.seasonRates.create') }}</span>
              </button>
            </div>
          </div>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
              <thead>
                <tr>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.seasonRates.name') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.seasonRates.priceNightly') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.seasonRates.minStay') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.seasonRates.status') }}
                  </th>
                  <th class="table__heading table__heading--actions --filled --bordered">
                    {{ $t('settings.views.seasonRates.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="table__row" v-for="(item) in rates" :key="item.id">
                  <td class="table__cell">{{ item.name }}</td>
                  <td class="table__cell">
                    <template v-if="item.priceNightly !== null">
                      {{ formatCurrency(item.priceNightly, item.currency) }}
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td class="table__cell">{{ item.minStayDays || '-' }}</td>
                  <td class="table__cell">
                    <span class="uk-badge badge--success" v-if="item.isCompleted">
                      {{ $t('settings.dicts.seasonRateStatuses.completed') }}
                    </span>
                    <span class="uk-badge badge--light" v-else>
                      {{ $t('settings.dicts.seasonRateStatuses.notCompleted') }}
                    </span>
                  </td>
                  <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
                    <div class="actions">
                      <template v-if="actionVisible === item.id">
                        <router-link
                          :to="{ name: 'settings-season-rates-overview', params: { rateId: item.id } }"
                          v-e2e="'edit'"
                          v-can:rateSeasons.write="user"
                          :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                          class="uk-button --icon table__action-btn animated-icon"
                        >
                          <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                        </router-link>

                        <button
                          @click="onDelete(item.id)"
                          v-e2e="'delete'"
                          v-can:rateSeasons.delete="user"
                          :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                          class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                        >
                          <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                        </button>
                      </template>
                      <button
                        v-else
                        v-e2e="'actions'"
                        @click="actionVisible = item.id"
                        class="uk-button --icon table__action-dots"
                        v-can:rateSeasons.write.delete="user"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
                      </button>
                      <div v-if="loading === item.id" class="loader table__action-loader" uk-spinner></div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot v-if="!rates.length">
                <tr class="table__row --footer">
                  <td colspan="6" class="table__no-data">
                    {{ $t('settings.views.seasonRates.noInfo') }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <settings-global-season-rate-create ref="modalRef" />
    </template>
  </core-layout-content>
</template>

<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { formatDate, formatCurrency } from '@/utils/intl';
import { LIMITS } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import SettingsGlobalSeasonRateCreate from '../../components/rates/SettingsGlobalSeasonRateCreate.vue';

export default {
  components: { SettingsGlobalSeasonRateCreate },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const modalRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);
    const rates = computed(() => store.state.settings.seasonRates.list);

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('settings.views.seasonRates.deleteConfirm'))
      .then((dialog) => {
        loading.value = id;

        return store.dispatch('settings/seasonRates/delete', id)
          .then(() => store.dispatch('settings/seasonRates/setList'))
          .then(() => uikit.notify('success', i18n.t('settings.views.seasonRates.deleteSuccess')))
          .finally(() => {
            loading.value = null;
            dialog.hide();
          });
      })
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      LIMITS,
      limits,
      modalRef,
      rates,
      actionVisible,
      loading,
      user,

      onAdd,
      onDelete,
      formatDate,
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
</style>
