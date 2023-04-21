<template>
  <core-layout-content :displayContent="guests.length > 0">
    <template #header>
      <core-layout-content-header :title="$t('guests.views.main.title')" icon="guests" />
    </template>
    <template #placeholder>
      <core-placeholder
        image="guests.svg"
        :title="$t('guests.views.main.placeholder.title')"
        :label="$t('guests.views.main.placeholder.label')"
        :description="$t('guests.views.main.placeholder.description')"
      />
    </template>

    <template #default>
      <div class="uk-position-relative uk-overflow-auto">
        <table class="uk-table uk-table-divider table uk-margin-remove">
          <thead>
          <tr>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-name'"
                column="name"
                class="table__sorter"
                :label="$t('guests.views.main.table.guest')"
                :arrow-visible="sort.key === 'firstName'"
                @order="onOrderChange('firstName', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-email'"
                column="email"
                class="table__sorter"
                :label="$t('guests.views.main.table.contact')"
                :arrow-visible="sort.key === 'email'"
                @order="onOrderChange('email', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-amountTotal'"
                column="amountTotal"
                class="table__sorter"
                :label="$t('guests.views.main.table.spent')"
                :arrow-visible="sort.key === 'amountTotal'"
                @order="onOrderChange('amountTotal', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-notes'"
                column="notes"
                class="table__sorter"
                :label="$t('guests.views.main.table.notes')"
                :arrow-visible="sort.key === 'notes'"
                @order="onOrderChange('notes', $event)"
              />
            </th>
            <th class="table__heading table__heading--actions">
              {{ $t('owners.views.main.table.actions') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr class="table__row" v-for="(guest) in guests" :key="guest.id">
            <td class="table__cell">
              <div class="name">{{ guest.firstName }} {{ guest.lastName }}</div>
              <div class="darken-meta user-meta" v-if="guest.countryCode">
                {{ formatCountryName(guest.countryCode) }}
              </div>
              <div class="meta user-meta uk-flex uk-flex-middle uk-text-nowrap">
                <span v-if="guest.totalNights">
                  {{ guest.totalNights }}
                  <core-svg :width="12" :src="require('@/assets/images/icons/nights.svg')" />
                </span>
                <span class="guest-meta" v-if="guest.totalGuests">
                  {{ guest.totalGuests }}
                  <core-svg :width="16" :src="require('@/assets/images/icons/user.svg')" />
                </span>
              </div>
            </td>
            <td class="table__cell">
              <div class="darken-meta">{{ guest.email }}</div>
              <div class="meta">{{ guest.phoneNumber }}</div>
            </td>
            <td class="table__cell">
              <div class="darken-meta">
                <template v-if="guest.currency">
                  {{ formatCurrency(guest.amountTotal || 0, guest.currency, locale) }}
                </template>
                <template v-else>-</template>
              </div>
            </td>
            <td class="table__cell"><div class="meta">{{ guest.notes || '-' }}</div></td>
            <td class="table__cell table__cell--actions">
              <div class="actions" v-can:guests.write="loggedUser">
                <template v-if="actionVisible === guest.id">
                  <router-link
                    v-e2e="'edit-guest'"
                    :uk-tooltip="'title: ' + $t('guests.views.main.actions.edit')"
                    class="uk-button --icon table__action-btn animated-icon"
                    :to="{ name: 'guests-edit', params: { id: guest.id } }"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>

                  <button
                    v-e2e="'delete-guest'"
                    v-can:guests.delete="loggedUser"
                    :uk-tooltip="'title: ' + $t('guests.views.main.actions.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                    @click="onDelete(guest.id)"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-else
                  v-e2e="'actions-guest'"
                  @click="actionVisible = guest.id"
                  class="uk-button --icon table__action-dots"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
                </button>
                <div v-if="loading === guest.id" class="loader table__action-loader" uk-spinner></div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-if="tableLoading" class="uk-overlay-default uk-position-cover">
          <div class="uk-position-center" uk-spinner></div>
        </div>
      </div>
      <div class="uk-flex uk-flex-right uk-margin-top uk-margin-right">
        <core-pagination
          :total="pagination.total || 10"
          :per-page="Number(pagination.perPage)"
          :disabled="tableLoading"
          @change="onPageChange"
        />
      </div>
    </template>
  </core-layout-content>
  <core-drawer ref="drawerRef" :loading="drawerLoading">
    <router-view />
  </core-drawer>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed,
  onMounted,
  ref,
  watchEffect,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { formatCurrency, formatCountryName, formatDate } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CoreSorter from '@/modules/core/components/CoreSorter.vue';
import CorePagination from '@/modules/core/components/CorePagination.vue';

export default {
  components: {
    CoreDrawer,
    CoreSorter,
    CorePagination,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();
    const router = useRouter();
    const i18n = useI18n();

    const loading = ref(null);
    const actionVisible = ref(null);
    const drawerRef = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const sort = computed(() => store.state.guests.guests.sort);
    const pagination = computed(() => store.state.guests.guests.pagination);
    const guests = computed(() => store.state.guests.guests.guests);
    const drawerLoading = computed(() => store.state.guests.guests.formLoading);
    const tableLoading = computed(() => store.state.guests.guests.tableLoading);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    const onOrderChange = (key, [, order]) => store.dispatch('guests/guests/sort', { key, order });

    const onPageChange = (page) => {
      store.dispatch('guests/guests/paginate', page);
    };

    const onDelete = (id) => {
      uikit.notification.closeAll(undefined, true);

      uikit.modals.deleteConfirm(i18n.t('guests.views.main.deleteConfirm'))
        .then((dialog) => store.dispatch('guests/guests/deleteGuestById', id)
          .then(() => uikit.notify('success', i18n.t('guests.views.main.deleteSuccess')))
          .then(() => store.dispatch('guests/guests/setGuestsList'))
          .finally(() => dialog.hide()))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'guests' });
      });
    });

    return {
      loading,
      actionVisible,
      drawerRef,
      loggedUser,
      sort,
      pagination,
      guests,
      drawerLoading,
      tableLoading,
      locale,
      timezone,
      dateFormat,

      onOrderChange,
      onPageChange,
      onDelete,
      formatCurrency,
      formatCountryName,
      formatDate,
    };
  },
};
</script>

<style lang="scss" scoped>
  .table {
    & &__cell {
      padding-top: 5px;
      padding-bottom: 5px;
    }

    & &__row {
      height: 78px;
    }
  }
  .actions {
    width: 120px;
  }
  .name {
    color: $base-color-darken;
    font-size: 1rem;
    font-weight: 700;
  }
  .darken-meta {
    color: rgba($base-color-darken, 0.7);
    font-weight: 500;
  }
  .meta {
    color: rgba($base-color-darken, 0.5);
  }
  .guest-meta {
    margin-left: 4px;
  }
  .user-meta {
    font-size: 0.75rem;
  }
</style>
