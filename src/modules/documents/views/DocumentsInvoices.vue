<template>
  <core-layout-content :displayContent="data?.length > 0">
    <template #placeholder>
      <core-placeholder
        image="files.svg"
        :title="$t('documents.views.invoices.placeholder.title')"
        :label="$t('documents.views.invoices.placeholder.label')"
        :description="$t('documents.views.invoices.placeholder.description')"
      >
        <router-link
          :to="{ name: 'documents-invoices-create' }"
          class="uk-button uk-button-primary uk-button--add"
          v-e2e="'create'"
          v-can:documentsInvoices.write="loggedUser"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          {{ $t('documents.views.invoices.add') }}
        </router-link>
      </core-placeholder>
    </template>
    <template #header>
      <core-layout-content-header
        class="no-print"
        :title="$t('documents.views.invoices.title')"
        :icon="'invoice'"
      >
        <div class="uk-margin-auto-left">
          <router-link
            :to="{ name: 'documents-invoices-create' }"
            class="uk-button uk-button-primary uk-button--add"
            v-e2e="'create'"
            v-can:documentsInvoices.write="loggedUser"
          >
            <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
            {{ $t('documents.views.invoices.add') }}
          </router-link>
        </div>
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="uk-position-relative">
        <table class="uk-table uk-table-divider table no-print">
          <thead>
          <tr>
            <th class="table__heading name-heading">
              <core-sorter
                v-e2e="'sort-invoiceNo'"
                column="invoiceNo"
                class="table__sorter uk-text-nowrap"
                :label="$t('documents.views.invoices.invoiceNo')"
                :arrow-visible="sort.key === 'invoiceNo'"
                @order="onOrderChange('invoiceNo', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-invoiceType'"
                column="invoiceType"
                class="table__sorter uk-text-nowrap"
                :label="$t('documents.views.invoices.invoiceType')"
                :arrow-visible="sort.key === 'invoiceType'"
                @order="onOrderChange('invoiceType', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-invoiceDate'"
                column="invoiceDate"
                class="table__sorter uk-text-nowrap"
                :label="$t('documents.views.invoices.invoiceDate')"
                :arrow-visible="sort.key === 'invoiceDate'"
                @order="onOrderChange('invoiceDate', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-buyerName'"
                column="buyerName"
                class="table__sorter uk-text-nowrap"
                :label="$t('documents.views.invoices.buyerName')"
                :arrow-visible="sort.key === 'buyerName'"
                @order="onOrderChange('buyerName', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-totalAmount'"
                column="totalAmount"
                class="table__sorter uk-text-nowrap uk-width-1-1 uk-flex-center"
                :label="$t('documents.views.invoices.totalAmount')"
                :arrow-visible="sort.key === 'totalAmount'"
                @order="onOrderChange('totalAmount', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-status'"
                column="status"
                class="table__sorter uk-text-nowrap"
                :label="$t('documents.views.invoices.status')"
                :arrow-visible="sort.key === 'status'"
                @order="onOrderChange('status', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-isPaid'"
                column="isPaid"
                class="table__sorter uk-text-nowrap"
                :label="$t('documents.views.invoices.isPaid')"
                :arrow-visible="sort.key === 'isPaid'"
                @order="onOrderChange('isPaid', $event)"
              />
            </th>
            <th class="table__heading table__heading--actions">
              {{ $t('documents.views.invoices.actions') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item) in data" :key="item.id" class="table__row">
            <td class="table__cell uk-text-nowrap uk-text-bold">
              {{ item.invoiceNo }}
            </td>
            <td class="table__cell">
              {{ $t(`documents.dicts.invoices.types.${item.invoiceType}`) }}
            </td>
            <td class="table__cell">
              {{ formatDate(item.invoiceDate, locale, timezone, dateFormat, false) }}
            </td>
            <td class="table__cell">
              {{ item.buyerName }}
            </td>
            <td class="table__cell uk-text-center">
              {{ formatCurrency(item.totalAmount, item.currency, locale) }}
            </td>
            <td class="table__cell">
              <span class="uk-badge badge--warn" v-if="item.status === 'draft'">
                {{ $t(`documents.dicts.invoices.statuses.${item.status}`) }}
              </span>
              <span class="uk-badge badge--success" v-else>
                {{ $t(`documents.dicts.invoices.statuses.${item.status}`) }}
              </span>
            </td>
            <td class="table__cell">
              <span class="uk-badge badge--success" v-if="item.isPaid">
                {{ $t('documents.shared.paid') }}
              </span>
              <span class="uk-badge badge--danger" v-else>
                {{ $t('documents.shared.unpaid') }}
              </span>
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
              <div class="actions" @click.stop>
                <template v-if="actionVisible === item.id">
                  <button
                    v-e2e="'download'"
                    v-can:documentsInvoices.read="loggedUser"
                    :uk-tooltip="'title: ' + $t('documents.views.invoices.download')"
                    @click="onDownload(item.id)"
                    class="uk-button --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/download.svg')" />
                  </button>
                  <router-link
                    v-e2e="'edit'"
                    v-can:documentsInvoices.write="loggedUser"
                    :uk-tooltip="'title: ' + $t('documents.views.invoices.edit')"
                    :to="{ name: 'documents-invoices-details', params: { id: item.id} }"
                    class="uk-button --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>

                  <button
                    v-e2e="'delete'"
                    v-can:documentsInvoices.delete="loggedUser"
                    :uk-tooltip="'title: ' + $t('documents.views.invoices.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                    @click="onDelete(item.id)"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>

                <button
                  v-else
                  v-e2e="'actions'"
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
        <div v-if="tableLoading" class="uk-overlay-default uk-position-cover">
          <div class="uk-position-center" uk-spinner></div>
        </div>
      </div>
      <div class="uk-flex uk-flex-right uk-margin-top uk-margin-right">
        <core-pagination
          :total="pagination.total"
          :per-page="Number(pagination.perPage)"
          :disabled="tableLoading"
          @change="onPageChange"
        />
      </div>
    </template>
  </core-layout-content>
  <core-drawer
    ref="drawerRef"
    class="invoices-drawer"
    :loading="drawerLoading"
  >
    <router-view />
  </core-drawer>
</template>

<script>
import {
  computed,
  onMounted,
  ref,
  watchEffect,
} from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { formatCurrency, formatDate } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import CoreSorter from '@/modules/core/components/CoreSorter.vue';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CorePagination from '@/modules/core/components/CorePagination.vue';
import { getApiUrl } from '@/utils/request';

export default {
  components: {
    CoreSorter,
    CoreDrawer,
    CorePagination,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();
    const router = useRouter();
    const route = useRoute();

    const loading = ref(null);
    const actionVisible = ref(null);
    const drawerRef = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const sort = computed(() => store.state.documents.invoices.sort);
    const data = computed(() => store.state.documents.invoices.invoices);
    const pagination = computed(() => store.state.documents.invoices.pagination);
    const tableLoading = computed(() => store.state.documents.invoices.listLoading);
    const drawerLoading = computed(() => store.state.documents.invoices.formLoading);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    const onOrderChange = (key, [, order]) => store.dispatch('invoices/sort', { key, order });

    const onDelete = (id) => {
      uikit.notification.closeAll(undefined, true);

      uikit.modals.deleteConfirm(i18n.t('documents.views.invoices.deleteConfirm'))
        .then((dialog) => {
          loading.value = id;

          return store.dispatch('invoices/deleteInvoiceById', id)
            .then(() => uikit.notify('success', i18n.t('documents.views.invoices.deleteSuccess')))
            .finally(() => {
              loading.value = null;
              dialog.hide();
            });
        })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onDownload = (id) => {
      window.open(getApiUrl(`documents/invoices/${id}/download?accessToken=${store.state.auth.accessToken}`), '_target');
    };

    const onPageChange = (page) => {
      store.dispatch('invoices/paginate', page);
    };

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'documents-invoices' });
        store.commit('invoices/SET_EXPECTED_INVOICE_NO', null);
      });
    });

    return {
      drawerRef,
      data,
      pagination,
      sort,
      tableLoading,
      drawerLoading,
      loading,
      actionVisible,
      loggedUser,
      locale,
      timezone,
      dateFormat,

      onOrderChange,
      onPageChange,
      onDelete,
      formatCurrency,
      formatDate,
      onDownload,
    };
  },
};
</script>

<style lang="scss" scoped>
.table__row {
  height: 75px;
  cursor: pointer;
}
.actions {
  width: 160px;
}
</style>
