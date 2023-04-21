<template>
  <core-layout-content :displayContent="owners.length > 0">
    <template #header>
      <core-layout-content-header :title="$t('owners.views.main.title')" icon="owners">
        <div class="core-layout-header__actions uk-margin-auto-left">
          <router-link
            v-can:owners.write="loggedUser"
            :to="{ name: 'owners-create' }"
            class="uk-button uk-button-primary uk-button--with-icon uk-button--add"
            v-e2e="'create'"
          >
            <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
            {{ $t('owners.views.main.add') }}
          </router-link>
        </div>
      </core-layout-content-header>
    </template>

    <template #placeholder>
      <core-placeholder
        image="owners.svg"
        :title="$t('owners.views.main.placeholder.title')"
        :label="$t('owners.views.main.placeholder.label')"
        :description="$t('owners.views.main.placeholder.description')"
      >
        <router-link
          v-can:owners.write="loggedUser"
          :to="{ name: 'owners-create' }"
          class="uk-button uk-button-primary uk-button--add"
          v-e2e="'create'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          {{ $t('owners.views.main.add') }}
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
                :label="$t('owners.views.main.table.subuser')"
                :arrow-visible="sort.key === 'firstName'"
                @order="onOrderChange('firstName', $event)"
              />
            </th>
            <th class="table__heading">
              <core-sorter
                v-e2e="'sort-email'"
                column="email"
                class="table__sorter"
                :label="$t('owners.shared.email')"
                :arrow-visible="sort.key === 'email'"
                @order="onOrderChange('email', $event)"
              />
            </th>
            <th class="table__heading">
              {{ $t('owners.views.main.table.units') }}
            </th>
            <th class="table__heading">
              {{ $t('owners.views.main.table.status') }}
            </th>
            <th class="table__heading table__heading--actions">
              {{ $t('owners.views.main.table.actions') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(owner) in owners" :key="owner.id" class="table__row owner-row">
            <td class="table__cell">
              <div class="uk-flex uk-flex-middle">
                <core-avatar
                  :size="38"
                  class="uk-margin-small-right"
                  :username="owner.firstName || owner.email"
                  :src="owner.avatar"
                />
                <div class="uk-text-nowrap">
                  {{ owner.firstName }} {{ owner.lastName }}
                </div>
              </div>
            </td>
            <td class="table__cell">
              {{ owner.email }}
            </td>
            <td class="table__cell">
              <div class="uk-flex uk-flex-wrap avatars">
                <router-link
                  v-for="item in owner.units"
                  :key="item"
                  :to="{ name: 'rental-overview', params: { id: item.propertyId } }"
                  class="uk-button uk-button-text"
                >
                  <core-avatar
                    :uk-tooltip="'title: ' + item.name"
                    :size="38"
                    :username="item.name"
                    :src="item.image"
                  />
                </router-link>
              </div>
            </td>
            <td class="table__cell">
              <core-entity-status :entity="owner" />
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === owner.id }">
              <div class="actions" v-can:users.write="loggedUser">
                <template v-if="actionVisible === owner.id">
                  <core-send-email
                    v-e2e="'send-invitation'"
                    v-if="!owner.confirmedAt && !owner.lockedAt"
                    :tooltip="$t('owners.views.main.actions.sendEmailConfirmation')"
                    :id="'owners:' + owner.id"
                    class="table__action-btn"
                    @click="onResendEmail(owner.id)"
                  />
                  <router-link
                    v-e2e="'edit-owner'"
                    :uk-tooltip="'title: ' + $t('owners.views.main.actions.edit')"
                    :to="{ name: 'owners-edit', params: { id: owner.id }}"
                    class="uk-button --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/edit.svg')" />
                  </router-link>

                  <button
                    v-e2e="'delete-owner'"
                    v-can:users.delete="loggedUser"
                    :uk-tooltip="'title: ' + $t('owners.views.main.actions.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                    @click="removeOwner(owner.id)"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-else
                  v-e2e="'actions-owner'"
                  @click="actionVisible = owner.id"
                  class="uk-button --icon table__action-dots"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
                </button>
                <div v-if="loading === owner.id" class="loader table__action-loader" uk-spinner></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </core-layout-content>
  <core-drawer ref="drawerRef" :loading="drawerLoading">
    <router-view />
  </core-drawer>
</template>

<script>
import {
  ref, computed, onMounted, watchEffect,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CoreSorter from '@/modules/core/components/CoreSorter.vue';
import CoreEntityStatus from '@/modules/core/components/CoreEntityStatus.vue';
import CoreSendEmail from '@/modules/core/components/CoreSendEmail.vue';

export default {
  components: {
    CoreDrawer,
    CoreSorter,
    CoreEntityStatus,
    CoreSendEmail,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const loading = ref(null);
    const actionVisible = ref(null);
    const drawerRef = ref(null);

    const owners = computed(() => store.state.owners.owners);
    const sort = computed(() => store.state.owners.sort);
    const loggedUser = computed(() => store.state.account.user);
    const drawerLoading = computed(() => store.state.owners.loading);

    const removeOwner = (id) => {
      uikit.modals.deleteConfirm(i18n.t('owners.views.main.deleteConfirm'))
        .then((dialog) => {
          loading.value = id;

          return store.dispatch('owners/deleteOwnerById', id)
            .then(() => uikit.notify('success', i18n.t('owners.views.main.deleteSuccess')))
            .finally(() => {
              loading.value = null;
              dialog.hide();
            });
        })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onResendEmail = (id) => {
      loading.value = id;

      store.dispatch('owners/sendEmailConfirmation', id)
        .then(() => uikit.notify('success', i18n.t('owners.views.main.emailSentSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = null; actionVisible.value = null; });
    };

    const onOrderChange = (key, order) => store.dispatch('owners/sort', { key, order });

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    onMounted(() => {
      uikit.util.on(drawerRef.value.$el, 'hide', () => {
        router.push({ name: 'owners' });
      });
    });

    return {
      loading,
      drawerRef,
      actionVisible,
      owners,
      sort,
      removeOwner,
      onOrderChange,
      onResendEmail,
      loggedUser,
      drawerLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.actions {
  width: 170px;
}
.avatars {
  & > * {
    margin-left: -10px;
    box-shadow: 0 0 0 2px $color-white;
    border-radius: 50%;

    &:first-child {
      margin: 0;
    }
  }
}
.owner-row {
  height: 75px;
}
</style>
