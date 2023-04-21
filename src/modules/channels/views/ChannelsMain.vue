<template>
  <core-layout-content
    :headerHasMargins="false"
    class="channels"
    :displayContent="channels.length > 0"
  >
    <template #header>
      <core-layout-content-header :title="$t('channels.views.main.title')" icon="channels" />
    </template>

    <template #placeholder>
      <core-placeholder
        image="channels.svg"
        :title="$t('channels.views.main.placeholder.title')"
        :label="$t('channels.views.main.placeholder.label')"
        :description="$t('channels.views.main.placeholder.description')"
      >
      </core-placeholder>
    </template>

    <template #default>
      <div class="card-list content">
        <channels-card
          v-for="channel in channels"
          :key="channel.id"
          :channel="channel"
        />
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import ChannelsCard from '@/modules/channels/components/ChannelsCard.vue';

export default {
  components: { ChannelsCard },
  setup() {
    const store = useStore();

    const channels = computed(() => store.state.channels.list);

    return {
      channels,
    };
  },
};
</script>

<style lang="scss" scoped>
.channels .content {
  padding-top: 15px;
}
</style>
