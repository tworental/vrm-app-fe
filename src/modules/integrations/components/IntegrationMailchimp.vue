<template>
  <v-form
    ref="formRef"
    name="mailchimp"
    class="uk-height-1-1"
    v-slot="{ errors, values, setErrors }"
    v-e2e
    @submit="onSubmit"
  >
    <core-layout-content>
      <template #header>
        <core-drawer-header>{{ $t('integrations.components.mailchimp.title') }}</core-drawer-header>
      </template>
      <template #default>
        <core-drawer-content class="uk-height-1-1 uk-flex uk-flex-column">
          <div class="info">
            <core-svg class="icon" height="150" :src="require('@/assets/images/integrations/mailchimp.svg')" />
            <div class="price">
            <span class="uk-badge badge--transparent badge--outline badge--big">
              {{ $t('integrations.shared.free') }}
            </span>
            </div>
            <div>
              <div class="uk-flex uk-flex-middle uk-flex-between">
                <h4 class="integration-heading">{{ $t('integrations.components.mailchimp.heading') }}</h4>
                <core-form-switcher
                  name="enabled"
                  :checked="Boolean(values.enabled)"
                  :disabled="!canUserEditIntegration"
                  @change="setErrors({ apiKey: undefined })"
                />
              </div>
              <p class="description">{{ $t('integrations.components.mailchimp.description') }}</p>
            </div>
          </div>

          <div class="integrations-actions uk-flex-1">
            <div>
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors['settings.apiKey'] }" for="apiKey">
                  {{ $t('integrations.components.mailchimp.apiKey') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="apiKey"
                    class="uk-input --outline"
                    as="input"
                    type="text"
                    name="settings.apiKey"
                    :label="$t('integrations.components.mailchimp.apiKey')"
                    :class="{ '--invalid': errors['settings.apiKey'] }"
                    rules="required_if:enabled,1|max:120"
                    v-e2e
                    @input="onSettingsChange(values.settings)"
                  />
                  <v-error-message class="input-error-message" name="settings.apiKey" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors['settings.server'] }" for="server">
                  {{ $t('integrations.components.mailchimp.server') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="server"
                    class="uk-input --outline"
                    as="input"
                    type="text"
                    name="settings.server"
                    :label="$t('integrations.components.mailchimp.server')"
                    :class="{ '--invalid': errors['settings.server'] }"
                    rules="required_if:enabled,1|max:5"
                    v-e2e
                    @input="onSettingsChange(values.settings)"
                  />
                  <v-error-message class="input-error-message" name="settings.server" />
                </div>
              </div>

              <div>
                <button
                  v-if="!hasSuccessfulConnection"
                  type="button"
                  class="uk-button uk-button-primary"
                  v-e2e="'connect'"
                  @click="onTryConnect(values.settings)"
                  :disabled="!values.settings || !values.settings.apiKey || !values.settings.server"
                >
                  <div v-if="connectLoading" uk-spinner="ratio: 0.5"></div>
                  {{ $t('integrations.shared.btn.connect') }}
                </button>
                <div v-else>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors['settings.listId'] }"
                      for="listId"
                    >
                      {{ $t('integrations.components.mailchimp.listId') }}
                    </label>
                    <div class="input-container">
                      <core-form-select
                        id="listId"
                        name="settings.listId"
                        :label="$t('integrations.components.mailchimp.listId')"
                        :class="{ '--invalid': errors['settings.listId'] }"
                        rules="required_if:enabled,1"
                        v-e2e
                        :data="lists"
                        :value="values?.settings?.listId"
                      />
                      <v-error-message class="input-error-message" name="settings.listId" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="uk-overlay-default uk-position-cover" v-if="!values.enabled"></div>
          </div>
        </core-drawer-content>
      </template>
      <template #footer>
        <core-drawer-footer>
          <button
            type="button"
            class="uk-button uk-button-link uk-margin-right"
            v-e2e="'cancel'"
            @click="onClose"
          >
            {{ $t('integrations.shared.btn.cancel') }}
          </button>
          <button
            v-can:integrations.write="user"
            class="uk-button uk-button-success"
            :disabled="!(hasSuccessfulConnection && values.settings && values.settings.listId) && values.enabled"
            :uk-tooltip="
              (!(hasSuccessfulConnection && values.settings && values.settings.listId) && values.enabled)
               ? 'title: ' + $t('integrations.components.mailchimp.connectRequired')
               : 'title:'"
            v-e2e="'save'"
          >
            <div v-if="loading" uk-spinner="ratio: 0.5"></div>
            {{ $t('integrations.shared.btn.save') }}
          </button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { ABILITIES, can, MODULES } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import CoreSvg from '@/modules/core/components/CoreSvg.vue';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreSvg,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormSwitcher,
    CoreFormSelect,
  },
  props: {
    integrationId: Number,
  },
  setup(props) {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();

    const formRef = ref(null);
    const loading = ref(false);
    const connectLoading = ref(false);

    const entity = computed(() => store.state.integrations.entity);
    const hasSuccessfulConnection = computed(() => store.state.integrations.mailchimp.connect);
    const lists = computed(() => store.state.integrations.mailchimp.lists.map((list) => ({
      label: list.name,
      value: list.id,
    })));

    const user = computed(() => store.state.account.user);
    const canUserEditIntegration = computed(() => can(user.value, MODULES.INTEGRATIONS, [ABILITIES.WRITE]));

    const onTryConnect = (data) => {
      connectLoading.value = true;

      store.dispatch('integrations/mailchimpConnect', data)
        .then(() => store.dispatch('integrations/mailchimpLists', data))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { connectLoading.value = false; });
    };

    const onSubmit = (data) => {
      loading.value = true;

      store.dispatch('integrations/setAttachedIntegration', { id: props.integrationId, data })
        .then(() => store.dispatch('integrations/getIntegrations'))
        .then(() => uikit.drawer.hide())
        .then(() => uikit.notify('success', i18n.t('integrations.components.mailchimp.success')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = false; });
    };

    const onClose = () => uikit.drawer.hide();

    const onSettingsChange = (settings) => {
      store.commit(
        'integrations/SET_MAILCHIMP_CONNECT',
        entity.value?.settings?.apiKey === settings.apiKey
        && entity.value?.settings?.server === settings.server,
      );
    };

    onMounted(() => {
      if (entity.value) {
        formRef.value.setValues({
          ...entity.value,
          settings: { ...entity.value.settings },
        });
      }
    });

    return {
      hasSuccessfulConnection,
      lists,
      formRef,
      loading,
      entity,
      connectLoading,
      user,
      canUserEditIntegration,

      onSubmit,
      onClose,
      onTryConnect,
      onSettingsChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.info {
  padding: $offcanvas-padding-y $offcanvas-padding-x;
  color: rgba($base-color-darken, 0.5);
  border-bottom: 1px solid rgba($alt-color, 0.3);
}
.integrations-actions {
  position: relative;
  padding: $offcanvas-padding-y $offcanvas-padding-x;
}
.integration-heading {
  font-size: 1rem;
  font-weight: 500;
  margin: 10px 0;
}
.price {
  text-align: center;
}
.description {
  margin: 0;
  text-align: justify;
}
.icon {
  display: block;
  margin: 0 auto;
}
</style>
