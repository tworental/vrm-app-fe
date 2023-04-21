<script>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useKit from '@/modules/core/composables/uikit';

import { confirmationRequest } from '../services';

export default {
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      await confirmationRequest(route.query)
        .then(() => uikit.notify('success', i18n.t('auth.notifications.confirmed')));

      router.push({ name: 'signin' });
    });

    return () => {};
  },
};
</script>
