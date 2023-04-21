<template>
  <core-layout-content :displayContent="true" :is-loading="loading">
    <template #header>
      <core-layout-content-header :title="$t('rentals.views.channelManager.title')" icon="channels" />
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
                <h5 class="uk-margin-small-left card__title">{{ $t('rentals.views.channels.title') }}</h5>
              </div>
              <p class="card__description">
                {{ $t('rentals.views.channels.description') }}
              </p>
            </div>
          </div>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
              <thead>
                <tr>
                  <th class="table__heading --filled --bordered">
                    {{ $t('rentals.views.channels.logo') }}
                  </th>
                  <th class="table__heading --filled --bordered --name-col">
                    {{ $t('rentals.views.channels.name') }}
                  </th>
                  <th class="table__heading --filled --bordered uk-text-center">
                    {{ $t('rentals.views.channels.status') }}
                  </th>
                  <th class="table__heading table__heading--actions --filled --bordered">
                    {{ $t('rentals.views.channels.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="table__row" v-for="(item) in channels" :key="item.id">
                  <td class="table__cell">
                    <core-svg
                      width="60"
                      height="40"
                      class="img --no-stroke"
                      :src="require('@/assets/images/channels/' + item.name + '.svg')"
                    />
                  </td>
                  <td class="table__cell --name-col">
                    {{ item.name }}
                  </td>
                  <td class="table__cell uk-text-center">
                    <span class="uk-badge badge--primary" v-if="item.active">
                      <span class="status-text">{{ $t('rentals.views.channels.statuses.activated') }}</span>
                      <core-svg width="8" :src="require('@/assets/images/icons/check.svg')" />
                    </span>
                    <span class="uk-badge badge--light" v-else>
                      {{ $t('rentals.views.channels.statuses.disabled') }}
                    </span>
                  </td>
                  <td class="table__cell table__cell--actions" :class="{ '--loading': loadingConnect }">
                    <div class="actions">
                      <button
                        type="button"
                        v-if="item.enabled"
                        class="uk-button --icon table__action-btn animated-icon"
                        :disabled="!item.active"
                        :uk-tooltip="'title: ' + $t('rentals.views.channels.setup')"
                        @click="$router.push({
                          name: 'rental-channel-manager-edit',
                          params: {
                            id: $route.params.id,
                            channelId: item.id,
                          }
                        })"
                        v-e2e="'setup'"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                      </button>
                      <button
                        type="button"
                        v-if="!item.enabled"
                        class="uk-button connect-btn --icon table__action-btn animated-icon"
                        :disabled="!item.active"
                        v-e2e="'connect'"
                        :uk-tooltip="'title: ' + $t('rentals.views.channels.connect')"
                        @click="onConnect(item.id)"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/connect.svg')" />
                      </button>
                      <button
                        type="button"
                        v-if="item.enabled"
                        class="uk-button connect-btn --icon table__action-btn animated-icon"
                        :disabled="!item.active"
                        v-e2e="'sync'"
                        :uk-tooltip="'title: ' + $t('rentals.views.channels.sync')"
                        @click="onSync(item.id)"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/connect.svg')" />
                      </button>
                      <button
                        type="button"
                        v-if="item.enabled"
                        class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                        :disabled="!item.active"
                        v-e2e="'disconnect'"
                        :uk-tooltip="'title: ' + $t('rentals.views.channels.disconnect')"
                        @click="onDisconnect(item.id)"
                      >
                        <core-svg :width="24" :src="require('@/assets/images/icons/disconnect.svg')" />
                      </button>

                      <div v-if="loadingConnect" class="loader table__action-loader" uk-spinner></div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot v-if="!channels.length">
                <tr class="table__row --footer">
                  <td colspan="7" class="table__no-data">
                    {{ $t('rentals.views.channels.noInfo') }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const i18n = useI18n();
    const uikit = useKit();

    const loading = ref(false);
    const loadingConnect = ref(false);

    const channels = computed(() => store.state.rentals.channels.list);

    onMounted(() => {
      loading.value = true;

      store.dispatch('rentals/channels/setList', route.params.id)
        .catch((error) => uikit.notify('danger', i18n.t(`core.errors.codes.${error.code}`)))
        .finally(() => { loading.value = false; });
    });

    const onConnect = (id) => {
      loadingConnect.value = true;
      store.dispatch('rentals/channels/update', {
        propertyId: route.params.id,
        id,
        data: { enabled: 1 },
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.channels.connectSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loadingConnect.value = false; });
    };

    const onDisconnect = (id) => {
      uikit.modals.actionConfirm(i18n.t('rentals.views.channels.disconnectConfirm'))
        .then((dialog) => {
          loadingConnect.value = true;

          return dialog;
        })
        .then((dialog) => store.dispatch('rentals/channels/update', {
          propertyId: route.params.id,
          id,
          data: { enabled: 0 },
        })
          .then(() => uikit.notify('success', i18n.t('rentals.views.channels.disconnectSuccess')))
          .finally(() => {
            loadingConnect.value = false;
            dialog.hide();
          }))
        .catch((error) => {
          if (error) {
            if (error.code === 'ALREADY_EXISTS') {
              uikit.notify('warning', i18n.t('rentals.views.channels.existActiveChannel'));
            } else {
              uikit.notify('danger', error.message);
            }
          }
        });
    };

    const onSync = (id) => {
      loadingConnect.value = true;

      store.dispatch('rentals/channels/sync', {
        propertyId: route.params.id,
        id,
      })
        .then(() => uikit.notify('success', i18n.t('rentals.views.channels.syncSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loadingConnect.value = false; });
    };

    return {
      loading,
      loadingConnect,
      channels,

      onConnect,
      onDisconnect,
      onSync,
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
  width: 150px;
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
.status-text {
  padding-right: 5px;
}
.connect-btn {
  color: $primary-color;

  &:hover {
    color: darken($primary-color, 3%);
  }
}
</style>
