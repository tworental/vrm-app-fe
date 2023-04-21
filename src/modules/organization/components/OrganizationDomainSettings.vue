<template>
  <v-form
    name="domain-settings"
    v-e2e
    v-slot="{ errors }"
  >
    <div class="uk-margin-bottom">
      <div class="identifier-control">
        <label
          class="input-label"
          :class="{ '--invalid': errors.identifier }"
          for="identifier"
        >
          {{ $t('organization.shared.identifier') }}
        </label>
        <div class="input-container uk-flex uk-flex-middle">
          <v-field
            id="identifier"
            class="uk-input --outline"
            name="identifier"
            type="text"
            :label="$t('organization.shared.identifier')"
            :class="{ '--invalid': errors.identifier }"
            rules="required"
            :value="account.identifier"
            :readonly="true"
            v-e2e
          />

          <span class="domain">{{ domain }}</span>
          <v-error-message class="input-error-message" name="identifier" />
        </div>
      </div>
    </div>
  </v-form>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, Form } from 'vee-validate';

export default {
  name: 'OrganizationDomainSettings',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
  },
  setup() {
    const store = useStore();

    const loading = ref(false);

    const account = computed(() => store.state.account.account);
    const domain = computed(() => `.${process.env.VUE_APP_DOMAIN}`);

    return {
      loading,
      account,
      domain,
    };
  },
};
</script>

<style lang="scss" scoped>
.domain {
  font-weight: 300;
  font-size: 0.875rem;
  color: rgba($base-color-darken, 0.7);
  padding-left: 10px;
}
.identifier-control {
  max-width: 300px;
}
</style>
