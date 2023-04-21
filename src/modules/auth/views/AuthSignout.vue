<script>
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    store.dispatch('auth/signout').then(() => {
      window.top.location.href = '/';
    });

    return () => {};
  },
};
</script>
