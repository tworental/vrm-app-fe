<template>
 <div>
   <button
     v-if="!user.oauth2GoogleId"
     type="button"
     class="uk-button uk-button-default auth__btn auth__btn-google"
     v-e2e="'google'"
     @click="onConnect"
   >
     <core-svg width="24" height="24" class="--no-stroke" :src="require('@/assets/images/icons/google.svg')" />
     <span class="uk-display-inline">{{ $t('account.components.googleSync.connect') }}</span>
   </button>
   <button
     v-else
     type="button"
     class="uk-button uk-button-default auth__btn auth__btn-google"
     v-e2e="'google'"
     @click="onDisconnect"
   >
     <core-svg width="24" height="24" class="--no-stroke" :src="require('@/assets/images/icons/google.svg')" />
     <span class="uk-display-inline">{{ $t('account.components.googleSync.disconnect') }}</span>
   </button>
 </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';

export default {
  setup() {
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();
    const i18n = useI18n();

    const user = computed(() => store.state.account.user);

    onMounted(() => {
      if (route.query.error) {
        if (route.query.error === 'NOT_FOUND') {
          uikit.notify('danger', i18n.t('core.errors.codes.USER_NOT_FOUND'));
        } else {
          uikit.notify('danger', i18n.t(`core.errors.codes.${route.query.error}`));
        }

        return;
      }

      if (route.query.connected) {
        uikit.notify('success', i18n.t('account.components.googleSync.connected'));
      }
    });

    const onConnect = () => {
      store.dispatch('account/connectGoogleSSO')
        .then(({ data }) => { window.location.href = data; })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    const onDisconnect = () => {
      uikit.modals.actionConfirm(i18n.t('account.components.googleSync.disconnectConfirm'))
        .then((dialog) => store.dispatch('account/disconnectGoogleSSO')
          .then(() => uikit.notify('success', i18n.t('account.components.googleSync.disconnected')))
          .finally(() => dialog.hide()))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    return {
      user,

      onConnect,
      onDisconnect,
    };
  },
};
</script>

<style lang="scss" scoped>
  .auth__btn-google {
    width: auto;
    padding-left: 30px;
    padding-right: 30px;
  }
</style>
