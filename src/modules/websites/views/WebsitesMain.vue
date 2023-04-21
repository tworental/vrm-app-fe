<template>
  <core-layout-content class="websites" :headerHasMargins="false" :displayContent="websites.length > 0">
    <template #header>
      <core-layout-content-header :title="$t('websites.views.main.title')" icon="websites">
        <div class="uk-margin-auto-left">
          <button
            type="button"
            class="uk-button uk-button-primary uk-button--add"
            v-e2e="'create'"
            @click="onAdd"
          >
            <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
            {{ $t('websites.views.main.add') }}
          </button>
        </div>
      </core-layout-content-header>
    </template>

    <template #placeholder>
      <core-placeholder
        image="websites.svg"
        :title="$t('websites.views.main.placeholder.title')"
        :label="$t('websites.views.main.placeholder.label')"
        :description="$t('websites.views.main.placeholder.description')"
      >
        <button
          type="button"
          class="uk-button uk-button-primary uk-button--add"
          v-e2e="'create'"
          @click="onAdd"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          {{ $t('websites.views.main.add') }}
        </button>
      </core-placeholder>
    </template>

    <template #default>
      <div class="card-list content">
        <websites-card
          v-for="website in websites"
          :key="website.id"
          class="card-list__item"
          :website="website"
        />
      </div>
    </template>
  </core-layout-content>
  <websites-create ref="modalRef" />
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import useKit from '@/modules/core/composables/uikit';
import WebsitesCard from '@/modules/websites/components/WebsitesCard.vue';
import WebsitesCreate from '@/modules/websites/components/WebsitesCreate.vue';

export default {
  components: { WebsitesCreate, WebsitesCard },
  setup() {
    const store = useStore();
    const uikit = useKit();

    const modalRef = ref(null);

    const websites = computed(() => store.state.websites.list);

    const onAdd = () => uikit.modals.show(modalRef.value?.$el);

    return {
      modalRef,
      websites,

      onAdd,
    };
  },
};
</script>

<style lang="scss" scoped>
.websites {
  .card-list {
    padding-top: 15px;
    --card-list-min-width: 250px;
  }
}
</style>
