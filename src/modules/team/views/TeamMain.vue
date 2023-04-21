<template>
  <core-layout-content :displayContent="users.length > 0">
    <template #header>
      <core-layout-content-header :title="$t('team.views.main.placeholder.title')" icon="team">
        <div class="core-layout-header__actions uk-margin-auto-left">
          <router-link
            v-e2e="'create-user'"
            v-can:users.write="loggedUser"
            :to="{ name: 'team-create' }"
            class="uk-button uk-button-primary uk-button--add"
          >
            <core-svg :width="16" :src="require('@/assets/images/icons/add.svg')" />

            {{ $t('team.views.main.addUser') }}
          </router-link>
        </div>
      </core-layout-content-header>
    </template>

    <template #placeholder>
      <core-placeholder
        image="team.svg"
        :title="$t('team.views.main.placeholder.title')"
        :label="$t('team.views.main.placeholder.label')"
        :description="$t('team.views.main.placeholder.description')"
      >
        <router-link
          v-e2e="'add'"
          v-can:users.write="loggedUser"
          :to="{ name: 'team-create' }"
          class="uk-button uk-button-primary uk-button--add"
        >
          <core-svg :width="16" :src="require('@/assets/images/icons/add.svg')" />

          {{ $t('team.views.main.addUser') }}
        </router-link>
      </core-placeholder>
    </template>

    <template #default>
      <table class="uk-table uk-table-divider table">
        <thead>
          <tr>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-name'"
                column="name"
                class="table__sorter"
                :label="$t('team.views.main.table.subuser')"
                :arrow-visible="sort.key === 'firstName'"
                @order="onOrderChange('firstName', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-email'"
                column="email"
                class="table__sorter"
                :label="$t('team.shared.email')"
                :arrow-visible="sort.key === 'email'"
                @order="onOrderChange('email', $event)"
              />
            </th>
            <th class="table__heading">
              {{ $t('team.views.main.table.status') }}
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-lastLogin'"
                column="lastLogin"
                class="table__sorter"
                :label="$t('team.views.main.table.lastLogin')"
                :arrow-visible="sort.key === 'lastSignInAt'"
                @order="onOrderChange('lastSignInAt', $event)"
              />
            </th>
            <th class="table__heading table__heading--actions">
              {{ $t('team.views.main.table.actions') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user) in users" :key="user.id" class="table__row">
            <td class="table__cell">
              <div class="user">
                <core-avatar
                  :size="38"
                  class="avatar"
                  :username="user.fullName || user.email"
                  :src="user.avatar"
                />
                <div>
                  <div class="name uk-text-nowrap">
                    <span v-if="user.firstName || user.lastName">{{ user.firstName }} {{ user.lastName }}</span>
                    <span v-else>-</span>
                  </div>
                  <div class="meta-info">
                    <team-member-permission-role class="role" :user="user" />
                  </div>
                </div>
              </div>
            </td>
            <td class="table__cell">
              {{ user.email }}
            </td>
            <td class="table__cell">
              <core-entity-status :entity="user" />
            </td>
            <td class="table__cell uk-text-nowrap">
              <div>
                {{
                  user.lastSignInAt
                    ? formatDate(user.lastSignInAt, locale, timezone, dateFormat)
                    : $t('team.views.main.table.never')
                }}
              </div>
              <small class="meta-info">
                {{
                  $t('team.views.main.table.createdAt', {
                    date: formatDate(user.createdAt, locale, timezone, dateFormat)
                  })
                }}
              </small>
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === user.id }">
              <div class="actions" v-if="!user.isAccountOwner" v-can:users.write="loggedUser">
                <template v-if="actionVisible === user.id">
                  <core-send-email
                    v-if="!user.confirmedAt && !user.lockedAt"
                    :tooltip="$t('team.views.main.actions.sendEmailConfirmation')"
                    :id="'team:' + user.id"
                    class="table__action-btn"
                    @click="onResendEmail(user.id)"
                  />
                  <template v-else>
                    <button
                      v-if="user.lockedAt"
                      v-e2e="'unlock-user'"
                      class="uk-button --icon table__action-btn animated-icon"
                      @click="onUnlockUser(user.id)"
                      :uk-tooltip="'title: ' + $t('team.views.main.actions.unsuspend')"
                    >
                      <core-svg :width="24" :src="require('@/assets/images/icons/unsuspend.svg')" />
                    </button>
                    <button
                      v-else
                      v-e2e="'lock-user'"
                      class="uk-button --icon table__action-btn animated-icon"
                      @click="onLockUser(user.id)"
                      :uk-tooltip="'title: ' + $t('team.views.main.actions.suspend')"
                    >
                      <core-svg :width="24" :src="require('@/assets/images/icons/suspend.svg')" />
                    </button>
                  </template>

                  <router-link
                    v-e2e="'edit-user'"
                    :uk-tooltip="'title: ' + $t('team.views.main.actions.edit')"
                    :to="{ name: 'team-edit', params: { id: user.id} }"
                    class="uk-button --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>

                  <button
                    v-e2e="'delete-user'"
                    v-can:users.delete="loggedUser"
                    :uk-tooltip="'title: ' + $t('team.views.main.actions.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                    @click="onDeleteUser(user.id)"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>

                <button
                  v-else
                  v-e2e="'actions-user'"
                  @click="actionVisible = user.id"
                  class="uk-button --icon table__action-dots"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
                </button>

                <div v-if="loading === user.id" class="loader table__action-loader" uk-spinner></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </core-layout-content>

  <core-drawer id="drawer" ref="drawerRef" class="team-drawer" :loading="drawerLoading" @close="onCloseDrawer">
    <router-view />
  </core-drawer>
</template>

<script>
import {
  ref, computed, watchEffect, onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { ABILITIES } from '@/utils/acl';
import { formatDate } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CoreSendEmail from '@/modules/core/components/CoreSendEmail.vue';
import CoreSorter from '@/modules/core/components/CoreSorter.vue';
import CoreEntityStatus from '@/modules/core/components/CoreEntityStatus.vue';
import TeamMemberPermissionRole from '../components/TeamMemberPermissionRole.vue';

export default {
  components: {
    CoreSendEmail,
    CoreDrawer,
    CoreSorter,
    CoreEntityStatus,
    TeamMemberPermissionRole,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const drawerRef = ref(null);
    const loading = ref(null);
    const actionVisible = ref(null);

    const loggedUser = computed(() => store.state.account.user);
    const sort = computed(() => store.state.team.sort);
    const users = computed(() => store.state.team.users);
    const drawerLoading = computed(() => store.state.team.loading);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    const onDeleteUser = (id) => uikit.modals.deleteConfirm(i18n.t('team.views.main.deleteConfirm'))
      .then((dialog) => store.dispatch('team/deleteUserById', id)
        .finally(() => dialog.hide()));

    const onResendEmail = (id) => {
      loading.value = id;

      store.dispatch('team/sendEmailConfirmation', id)
        .then(() => uikit.notify('success', i18n.t('team.views.main.emailSentSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = null; actionVisible.value = null; });
    };

    const onLockUser = (id) => {
      loading.value = id;

      store.dispatch('team/changeLockedState', { id, state: 'lock' })
        .then(() => uikit.notify('success', i18n.t('team.views.main.suspendUserSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = null; actionVisible.value = null; });
    };

    const onUnlockUser = (id) => {
      loading.value = id;

      store.dispatch('team/changeLockedState', { id, state: 'unlock' })
        .then(() => uikit.notify('success', i18n.t('team.views.main.unsuspendUserSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = null; actionVisible.value = null; });
    };

    const onOrderChange = (key, order) => store.dispatch('team/sort', { key, order });

    const onCloseDrawer = () => router.push({ name: 'team' });

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value?.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'team' });
      });
    });

    return {
      locale,
      timezone,
      ABILITIES,
      drawerRef,
      users,
      loggedUser,
      formatDate,
      sort,
      loading,
      drawerLoading,
      actionVisible,
      dateFormat,

      onDeleteUser,
      onCloseDrawer,
      onResendEmail,
      onLockUser,
      onUnlockUser,
      onOrderChange,
    };
  },
};
</script>

<style lang="scss" scoped>
  .user {
    display: flex;
    align-items: center;

    .avatar {
      min-width: 38px;
      margin-right: 20px;
    }
    .role {
      @include toWideMobile {
        padding-right: 10px;
      }
    }
  }
  .actions {
    width: 170px;
  }
</style>
