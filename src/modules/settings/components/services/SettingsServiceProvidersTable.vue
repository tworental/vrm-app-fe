<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/service-providers.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.components.serviceProvidersTable.title') }}</h5>
        </div>
        <p class="card__description">{{ $t('settings.components.serviceProvidersTable.description') }}</p>
      </div>
      <div>
        <router-link
          :to="{ name: 'settings-service-providers-create' }"
          class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
          v-e2e="'create-provider'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-wide-mobile">{{ $t('settings.components.serviceProvidersTable.create') }}</span>
        </router-link>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr>
            <th class="table__heading --filled --bordered --name-col">
              {{ $t('settings.components.serviceProvidersTable.name') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceProvidersTable.email') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceProvidersTable.phoneNumber') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceProvidersTable.companyName') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceProvidersTable.contactPerson') }}
            </th>
            <th class="table__heading table__heading--actions --filled --bordered">
              {{ $t('settings.components.serviceProvidersTable.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="(item) in serviceProviders" :key="item.id">
            <td class="table__cell --name-col">
              {{ item.name || '-' }}
            </td>
            <td class="table__cell">
              {{ item.email || '-' }}
            </td>
            <td class="table__cell">
              {{ item.phoneNumber || '-' }}
            </td>
            <td class="table__cell">
              {{ item.companyName || '-' }}
            </td>
            <td class="table__cell">
              {{ item.contactPerson || '-' }}
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
              <div class="actions">
                <template v-if="actionVisible === item.id">
                  <router-link
                    :to="{ name: 'settings-service-providers-edit', params: { id: item.id } }"
                    v-e2e="'edit-provider'"
                    :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                    class="uk-button --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>
                  <button
                    @click="onDelete(item.id)"
                    v-e2e="'delete-provider'"
                    :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-else
                  v-e2e="'actions-provider'"
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
        <tfoot v-if="!serviceProviders.length">
          <tr class="table__row --footer">
            <td colspan="6" class="table__no-data">
              {{ $t('settings.components.serviceProvidersTable.noInfo') }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <core-drawer ref="drawerRef" :loading="formLoading">
      <router-view />
    </core-drawer>
  </div>
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

import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';

export default {
  name: 'SettingsServiceProvidersTable',
  components: {
    CoreDrawer,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const actionVisible = ref(null);
    const loading = ref(null);
    const drawerRef = ref(null);

    const serviceProviders = computed(() => store.state.settings.serviceProviders.list);
    const formLoading = computed(() => store.state.settings.serviceProviders.formLoading);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('settings.components.serviceProvidersTable.deleteConfirm'))
      .then((dialog) => {
        loading.value = id;

        return store.dispatch('settings/serviceProviders/delete', id)
          .then(() => store.dispatch('settings/serviceProviders/setList'))
          .then(() => uikit.notify('success', i18n.t('settings.components.serviceProvidersTable.deleteSuccess')))
          .finally(() => {
            loading.value = null;
            dialog.hide();
          });
      })
      .catch((error) => error && uikit.notify('danger', error.message));

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'settings-services' });
      });
    });

    return {
      serviceProviders,
      formLoading,
      actionVisible,
      loading,
      drawerRef,

      onDelete,
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

    .table__cell {
      padding-top: 0;
      padding-bottom: 0;
    }

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
}
.provider-column {
  padding-left: 40px;
}
.--name-col {
  width: 22%;
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
