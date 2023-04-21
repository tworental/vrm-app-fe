<template>
  <div class="card" v-if="isAllowed">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <core-svg
            :width="24"
            :src="require('@/assets/images/icons/cog-hand.svg')"
          />
          <h5 class="uk-margin-small-left card__title">{{ $t('settings.components.serviceNotifications.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('settings.components.serviceNotifications.description') }}
        </p>
      </div>
      <button
        v-can:services.write="loggedUser"
        class="uk-button uk-button-primary uk-button--add-from-wide-mobile"
        type="button"
        v-e2e="'create-reminder'"
        @click="$router.push({
          name: 'settings-services-reminders-create',
          params: { id: $route.params.id }
        })"
        v-quota="{
          limits,
          name: LIMITS.APP_SERVICES_REMINDERS_SIZE_LIMIT,
          value: reminders.length,
          label: $t('core.limits.quotaExceeded')
        }"
      >
        <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
        <span class="--from-wide-mobile">{{ $t('settings.components.serviceNotifications.createReminder') }}</span>
      </button>
    </div>

    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr>
            <th class="table__heading --filled --bordered">#</th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceNotifications.phone') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceNotifications.email') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('settings.components.serviceNotifications.when') }}
            </th>
            <th class="table__heading --filled --bordered table__heading--actions"></th>
          </tr>
        </thead>
        <tbody v-if="reminders.length">
          <tr class="table__row" v-for="(item, idx) in reminders" :key="item.id">
            <td class="table__cell">{{ idx + 1 }}</td>
            <td class="table__cell">{{ item.phoneNumber || '-' }}</td>
            <td class="table__cell">{{ item.email || '-' }}</td>
            <td class="table__cell uk-text-lowercase">
              {{ item.time }}
              {{ $t('settings.dicts.periods.' + item.timeUnit) }}
              {{ $t('settings.dicts.notificationTimes.' + item.eventType) }}
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
              <div class="actions" v-can:services.write="loggedUser">
                <template v-if="actionVisible === item.id">
                  <router-link
                    :to="{
                      name: 'settings-services-reminders-overview',
                      params: { id: $route.params.id, reminderId: item.id }
                    }"
                    v-can:services.write="loggedUser"
                    v-e2e="'edit-reminder'"
                    :uk-tooltip="'title: ' + $t('settings.shared.actions.edit')"
                    class="uk-button --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>
                  <button
                    type="button"
                    @click="onDelete($route.params.id, item.id)"
                    v-can:services.delete="loggedUser"
                    v-e2e="'delete-reminder'"
                    :uk-tooltip="'title: ' + $t('settings.shared.actions.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-else
                  v-e2e="'actions-reminder'"
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
        <tfoot v-else>
          <tr class="table__row --footer">
            <td colspan="7" class="table__no-data">
              {{ $t('settings.components.serviceNotifications.noInfo') }}
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
import { hasAccess, LIMITS, MODULES } from '@/utils/acl';

export default {
  name: 'SettingsServiceNotifications',
  components: {
    CoreDrawer,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const route = useRoute();
    const router = useRouter();

    const drawerRef = ref(null);
    const actionVisible = ref(null);
    const loading = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const user = computed(() => store.state.core.user);
    const limits = computed(() => store.state.core.limits);
    const isAllowed = computed(
      () => hasAccess(limits.value, LIMITS.APP_SERVICES_REMINDERS_ENABLED, user.value, MODULES.SERVICES_REMINDERS),
    );
    const reminders = computed(() => store.state.settings.services.reminders.list);
    const formLoading = computed(() => store.state.settings.services.reminders.formLoading);

    const onDelete = (serviceId, id) => uikit.modals.deleteConfirm(i18n.t('settings.components.serviceNotifications.deleteConfirm'))
      .then((dialog) => store.dispatch('settings/services/reminders/delete', { serviceId, id })
        .then(() => store.dispatch('settings/services/reminders/setList', serviceId))
        .then(() => uikit.notify('success', i18n.t('settings.components.serviceNotifications.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    watchEffect(() => {
      if (drawerRef.value) {
        uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
      }
    }, { flush: 'post' });

    onMounted(() => {
      if (isAllowed.value) {
        store.dispatch('settings/services/reminders/setList', route.params.id);
      }
      if (drawerRef.value) {
        uikit.util.on(drawerRef.value.$el, 'hide', () => {
          router.push({ name: 'settings-services-overview', params: { id: route.params.id } });
        });
      }
    });

    return {
      loggedUser,
      LIMITS,
      drawerRef,
      actionVisible,
      loading,
      limits,
      isAllowed,
      reminders,
      formLoading,

      onDelete,
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
    align-items: flex-start;
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
</style>
