<script>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useKit from '@/modules/core/composables/uikit';

export default {
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const router = useRouter();

    uikit.notify('success', i18n.t('billing.subscription.success'));

    router.push({ name: 'billing-overview' });

    return () => {};
  },
};
</script>
