<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header icon="websites" :title="website.name">
        <div class="uk-margin-auto-left uk-flex uk-flex-middle">
          <button
            type="button"
            class="uk-button uk-button-link uk-margin-medium-right"
            v-e2e="'preview'"
          >
            <core-svg width="20" :src="require('@/assets/images/icons/eye-open.svg')" />
            {{ $t('websites.views.form.preview') }}
          </button>
          <button
            type="button"
            class="uk-button uk-button-primary uk-button--add"
            v-e2e="'preview'"
          >
            <core-svg width="20" :src="require('@/assets/images/icons/publish.svg')" />
            {{ $t('websites.views.form.release') }}
          </button>
        </div>
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <div class="uk-margin-bottom">
          <websites-main-info :website="website" />
        </div>

        <div class="uk-margin-bottom">
          <websites-subpages />
        </div>
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import WebsitesMainInfo from '@/modules/websites/components/WebsitesMainInfo.vue';
import WebsitesSubpages from '@/modules/websites/components/WebsitesSubpages.vue';

export default {
  components: {
    WebsitesMainInfo,
    WebsitesSubpages,
  },
  setup() {
    const store = useStore();

    const website = computed(() => store.state.websites.entity);

    return {
      website,
    };
  },
};
</script>
