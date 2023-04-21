<template>
  <core-layout-content :headerHasMargins="false" :displayContent="integrations.length > 0" class="integrations">
    <template #header>
      <core-layout-content-header title="Integrations" icon="integrations" />
    </template>

    <template #placeholder>
      <core-placeholder
        image="integrations.svg"
        title="Integrations"
        label="label"
        description="Currently there are no Integrations"
      >
      </core-placeholder>
    </template>

    <template #default>
      <div class="card-list content">
        <integration-card
          v-for="integration in integrations"
          :key="integration.id"
          :integration="integration"
          @click="showDetails(integration)"
          class="card-list__item"
          v-e2e="'integration-card'"
        />
      </div>
    </template>
  </core-layout-content>
  <core-drawer ref="drawerRef">
    <component v-if="drawerShown" :is="component" :integration-id="currentIntegration"></component>
  </core-drawer>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import IntegrationCard from '../components/IntegrationCard.vue';
import IntegrationIntegromat from '../components/IntegrationIntegromat.vue';
import IntegrationMailchimp from '../components/IntegrationMailchimp.vue';
import IntegrationPriceLabs from '../components/IntegrationPriceLabs.vue';
import IntegrationPrivateLabel from '../components/IntegrationPrivateLabel.vue';
import IntegrationStripe from '../components/IntegrationStripe.vue';
import IntegrationWhiteLabel from '../components/IntegrationWhiteLabel.vue';
import IntegrationZapier from '../components/IntegrationZapier.vue';

export default {
  components: {
    CoreDrawer,
    IntegrationCard,
    IntegrationIntegromat,
    IntegrationMailchimp,
    IntegrationPriceLabs,
    IntegrationPrivateLabel,
    IntegrationStripe,
    IntegrationWhiteLabel,
    IntegrationZapier,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();

    const integrations = computed(() => store.state.integrations.integrations);

    const drawerRef = ref(null);
    const drawerShown = ref(false);
    const currentIntegration = ref(null);
    // HACK: needs to render any component firstly
    const component = ref(integrations.value[0]?.name);

    const showDetails = ({ id, name }) => {
      currentIntegration.value = id;
      store.dispatch('integrations/getAttachedIntegration', id)
        .then((data) => (data ? store.dispatch('integrations/mailchimpConnect', data.settings) : Promise.resolve())
          .then(() => (data ? store.dispatch('integrations/mailchimpLists', data.settings) : Promise.resolve()))
          .catch(() => null))
        .then(() => {
          component.value = [
            'Integration', name.replace(/(^.)/, (m) => m.toUpperCase()),
          ].join('');

          uikit.drawer.show(drawerRef.value.$el);
        });
    };

    onMounted(() => {
      uikit.util.on(drawerRef.value?.$el, 'beforeshow', () => {
        drawerShown.value = true;
      }, { self: true });

      uikit.util.on(drawerRef.value?.$el, 'hidden', () => {
        drawerShown.value = false;

        store.dispatch('integrations/reset');
      }, { self: true });
    });

    return {
      drawerRef,
      component,
      integrations,
      drawerShown,
      currentIntegration,

      showDetails,
    };
  },
};
</script>

<style lang="scss" scoped>
.integrations .card-list {
  padding-top: 15px;
}
</style>
