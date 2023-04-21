<template>
  <div>
    <auth-phone-verification-form
      v-if="verifyMode"
      class="card"
      @save="verifyMode = false; data = $event"
    />
    <auth-phone-confirmation-form
      v-else
      class="card"
      :data="data"
      @cancel="verifyMode = true"
    />
  </div>
</template>

<script>
import { ref } from 'vue';

import AuthPhoneVerificationForm from '@/modules/auth/components/AuthPhoneVerificationForm.vue';
import AuthPhoneConfirmationForm from '@/modules/auth/components/AuthPhoneConfirmationForm.vue';

export default {
  components: {
    AuthPhoneVerificationForm,
    AuthPhoneConfirmationForm,
  },
  setup() {
    const verifyMode = ref(true);
    const data = ref(null);

    return {
      verifyMode,
      data,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  background-color: $color-white;
  padding: 30px 40px;
  border: 1px solid rgba($alt-color, 0.2);
  min-width: 400px;
  max-width: 400px;
}
</style>
