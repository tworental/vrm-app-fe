<template>
  <core-layout :has-nav="true" class="storage-content">
    <template v-slot:nav="{ onNavItemClicked }">
      <div
        class="navbar navbar--page uk-navbar-container vertical uk-navbar uk-navbar-transparent"
      >
        <core-layout-content :header-has-margins="false">
          <template #header>
            <core-layout-content-header
              :title="$t('storage.views.main.title')"
              icon="storage"
              class="storage-sidebar-header"
            />
          </template>
          <template #default>
            <div>
              <storage-shortcuts
                :items="locations"
                :label="$t('storage.views.main.locations')"
                :translate="true"
                class="uk-margin-top"
                @click="onNavItemClicked"
              />

              <storage-shortcuts
                icon="folder"
                :items="pinned"
                :label="$t('storage.views.main.pinned')"
                :deletable="true"
                :pinned="true"
                class="uk-margin-top"
                @delete="onDeletePinned"
                @click="onNavItemClicked"
              />
            </div>
          </template>
          <template #footer>
            <div class="storage-sidebar-footer">
              <storage-capacity
                class="uk-margin-auto"
              />
            </div>
          </template>
        </core-layout-content>
      </div>
    </template>

    <template #default>
      <router-view />
    </template>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';

import StorageShortcuts from '../components/StorageShortcuts.vue';
import StorageCapacity from '../components/StorageCapacity.vue';

export default {
  components: {
    StorageShortcuts,
    StorageCapacity,
  },
  setup() {
    const uikit = useKit();
    const store = useStore();
    const i18n = useI18n();

    const pinned = computed(() => store.getters['storage/pinned']);
    const locations = computed(() => store.getters['storage/locations']);

    const onDeletePinned = (id) => (
      uikit.modals.deleteConfirm(i18n.t('storage.views.main.unpin'))
        .then((dialog) => store.dispatch('storage/updateFolder', { id, data: { pinned: 0 } })
          .finally(() => dialog.hide()))
        .catch((err) => uikit.errorHandler(err).catch(({ status, message }) => {
          if (status === 401) {
            window.location.reload();
          } else {
            uikit.notify('danger', message);
          }
        }))
    );

    return {
      locations,
      pinned,
      onDeletePinned,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  padding: 0;
}
.storage-sidebar {
  &-header {
    padding: 15px 12px;
    border-bottom: 1px solid rgba($base-color-darken, 0.1);
  }
  &-footer {
    border-top: 1px solid rgba($base-color-darken, 0.1);
  }
}
.storage-content {
  ::v-deep() .core-skeleton__nav {
    overflow-y: auto;
  }
}
</style>
