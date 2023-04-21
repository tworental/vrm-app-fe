<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.views.salesChannels.title')" icon="network" />
    </template>

    <template #default>
      <div class="content">
        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__heading uk-flex uk-flex-middle">
                <core-svg
                  :width="24"
                  :src="require('@/assets/images/icons/network.svg')"
                />
                <h5 class="uk-margin-small-left card__title">{{ $t('settings.views.salesChannels.title') }}</h5>
              </div>
              <p class="card__description">
                {{ $t('settings.views.salesChannels.description') }}
              </p>
            </div>
            <div>
              <button
                v-can:salesChannels.write="loggedUser"
                type="button"
                class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
                v-e2e="'create-sales-channel'"
                @click="onAdd"
              >
                <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
                <span class="--from-wide-mobile">{{ $t('settings.views.salesChannels.create') }}</span>
              </button>
            </div>
          </div>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
              <thead>
              <tr>
                <th class="table__heading --filled --bordered --name-col">
                  {{ $t('settings.views.salesChannels.name') }}
                </th>
                <th class="table__heading --filled --bordered uk-text-center">
                  {{ $t('settings.views.salesChannels.commission') }}
                </th>
                <th class="table__heading table__heading--actions --filled --bordered">
                  {{ $t('settings.views.salesChannels.action') }}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="table__row" v-for="(item) in channels" :key="item.id">
                <td class="table__cell --name-col">
                  {{ item.name }}
                </td>
                <td class="table__cell uk-text-center">
                  {{ item.commission }}%
                </td>
                <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
                  <div class="actions">
                    <template v-if="actionVisible === item.id">
                      <button
                        type="button"
                        v-e2e="'edit'"
                        v-can:salesChannels.write="loggedUser"
                        :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                        class="uk-button --icon table__action-btn animated-icon"
                        @click="onEdit(item.id)"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                      </button>

                      <button
                        @click="onDelete(item.id)"
                        v-e2e="'delete'"
                        v-can:salesChannels.delete="loggedUser"
                        :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                        class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                      </button>
                    </template>
                    <button
                      v-else
                      v-e2e="'actions'"
                      v-can:salesChannels.write.delete="loggedUser"
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
              <tfoot v-if="!channels.length">
              <tr class="table__row --footer">
                <td colspan="7" class="table__no-data">
                  {{ $t('settings.views.salesChannels.noInfo') }}
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
  </core-layout-content>
  <settings-sales-channel-modal ref="modalRef" />
</template>

<script>
import {
  computed,
  ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import useKit from '@/modules/core/composables/uikit';
import SettingsSalesChannelModal from '@/modules/settings/views/sales-channels/SettingsSalesChannelModal.vue';

export default {
  components: { SettingsSalesChannelModal },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const modalRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const channels = computed(() => store.state.settings.salesChannels.list);
    const formLoading = computed(() => store.state.settings.salesChannels.formLoading);
    const loggedUser = computed(() => store.state.account.user);

    const onAdd = () => {
      uikit.modals.show(modalRef.value?.$el);
    };

    const onEdit = async (id) => {
      await store.dispatch('settings/salesChannels/setEntity', id);
      uikit.modals.show(modalRef.value?.$el);
    };

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('settings.views.salesChannels.deleteConfirm'))
      .then((dialog) => {
        loading.value = id;

        return store.dispatch('settings/salesChannels/delete', id)
          .then(() => store.dispatch('settings/salesChannels/setList'))
          .then(() => uikit.notify('success', i18n.t('settings.views.salesChannels.deleteSuccess')))
          .finally(() => {
            loading.value = null;
            dialog.hide();
          });
      })
      .catch((error) => error && uikit.notify('danger', error.message));

    return {
      modalRef,
      channels,
      formLoading,
      actionVisible,
      loading,
      loggedUser,

      onAdd,
      onEdit,
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
    padding: 20px;
    display: flex;
    justify-content: space-between;
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
  max-width: 500px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
