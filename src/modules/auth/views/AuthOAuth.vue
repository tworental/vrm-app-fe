<template>
  <div class="auth-container uk-container">
    <div class="auth__content">
      <div uk-spinner="ratio: 1"></div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const uikit = useKit();
    const i18n = useI18n();

    onMounted(() => {
      if (route.query.error) {
        if (route.query.error === 'NOT_FOUND') {
          uikit.notify('danger', i18n.t('core.errors.codes.USER_NOT_FOUND'));
        } else {
          uikit.notify('danger', i18n.t(`core.errors.codes.${route.query.error}`));
        }
        router.push({ name: 'dashboard' });
        return;
      }

      if (route.query.accessToken && route.query.expiresIn) {
        const expires = (new Date(Date.now() + Number(route.query.expiresIn) * 1000)).toUTCString();

        document.cookie = [
          `accessToken=${route.query.accessToken}`,
          `expires=${expires}`,
          'path=/',
        ].join(';');

        window.top.location.href = '/';
      }
    });

    return () => {};
  },
};
</script>
