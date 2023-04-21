<template>
  <core-layout-content :displayContent="true">
    <template #header>
      <core-layout-content-header :title="$t('settings.views.customerContacts.title')" icon="house-person" />
    </template>

    <template #default>
      <div class="content">
        <div class="card">
          <div class="card__header">
            <div>
              <div class="card__heading uk-flex uk-flex-middle">
                <core-svg
                  :width="24"
                  :src="require('@/assets/images/icons/house-person.svg')"
                />
                <h5 class="uk-margin-small-left card__title">{{ $t('settings.views.customerContacts.title') }}</h5>
              </div>
              <p class="card__description">
                {{ $t('settings.views.customerContacts.description') }}
              </p>
            </div>
            <div>
              <button
                v-can:customerContacts.write="loggedUser"
                type="button"
                class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
                v-e2e="'create-customer-contact'"
                @click="$router.push({ name: 'settings-customer-contacts-create' })"
              >
                <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
                <span class="--from-wide-mobile">{{ $t('settings.views.customerContacts.create') }}</span>
              </button>
            </div>
          </div>
          <div class="uk-overflow-auto">
            <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
              <thead>
                <tr>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.customerContacts.name') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.customerContacts.email') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.customerContacts.phoneNumber') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('rentals.components.customerContacts.isDefault') }}
                  </th>
                  <th class="table__heading --filled --bordered">
                    {{ $t('settings.views.customerContacts.bio') }}
                  </th>
                  <th class="table__heading table__heading--actions --filled --bordered">
                    {{ $t('settings.views.customerContacts.action') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="table__row" v-for="(item) in contacts" :key="item.id">
                  <td class="table__cell">
                    <div class="uk-flex uk-flex-middle">
                      <core-avatar
                        :size="30"
                        class="uk-margin-small-right"
                        :username="item.firstName || item.email"
                        :src="item.avatar"
                      />
                      <div class="uk-text-nowrap">
                        {{ item.firstName }} {{ item.lastName }}
                      </div>
                    </div>
                  </td>
                  <td class="table__cell">
                    {{ item.email }}
                  </td>
                  <td class="table__cell">
                    <div>{{ item.primaryPhoneNumber }}</div>
                    <small
                      v-if="item.additionalPhoneNumber"
                      class="meta-info"
                    >{{ item.additionalPhoneNumber }}</small>
                  </td>
                  <td class="table__cell">
                    <span class="uk-badge badge--success" v-if="item.isDefault">
                      {{ $t('rentals.components.customerContacts.default') }}
                    </span>
                  </td>
                  <td class="table__cell">
                    <div class="meta-info">
                      {{ item.bio }}
                    </div>
                  </td>
                  <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
                    <div class="actions">
                      <template v-if="actionVisible === item.id">
                        <button
                          type="button"
                          v-e2e="'edit'"
                          :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                          class="uk-button --icon table__action-btn animated-icon"
                          v-can:customerContacts.write="loggedUser"
                          @click="$router.push({ name: 'settings-customer-contacts-edit', params: { id: item.id } })"
                        >
                          <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                        </button>

                        <button
                          @click="onDelete(item.id)"
                          v-e2e="'delete'"
                          :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                          class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                          v-can:customerContacts.delete="loggedUser"
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
              <tfoot v-if="!contacts.length">
                <tr class="table__row --footer">
                  <td colspan="7" class="table__no-data">
                    {{ $t('settings.views.customerContacts.noInfo') }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
  </core-layout-content>
  <core-drawer ref="drawerRef" :loading="formLoading">
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
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';

export default {
  components: {
    CoreDrawer,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const drawerRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const contacts = computed(() => store.state.settings.customerContacts.list);
    const formLoading = computed(() => store.state.settings.customerContacts.formLoading);

    const onDelete = (id) => uikit.modals.deleteConfirm(i18n.t('settings.views.customerContacts.deleteConfirm'))
      .then((dialog) => {
        loading.value = id;

        return store.dispatch('settings/customerContacts/delete', id)
          .then(() => store.dispatch('settings/customerContacts/setList'))
          .then(() => uikit.notify('success', i18n.t('settings.views.customerContacts.deleteSuccess')))
          .finally(() => {
            loading.value = null;
            dialog.hide();
          });
      })
      .catch((error) => error && uikit.notify('danger', error.message));

    watchEffect(() => {
      if (drawerRef.value) {
        uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
      }
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'settings-customer-contacts' });
      });
    });

    return {
      contacts,
      formLoading,
      drawerRef,
      actionVisible,
      loading,
      loggedUser,

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
</style>
