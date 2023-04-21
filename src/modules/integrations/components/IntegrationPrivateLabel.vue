<template>
  <core-drawer-header>{{ $t('integrations.components.privateLabel.title') }}</core-drawer-header>
  <core-drawer-content>
    <div class="info">
      <core-svg class="icon" height="160" :src="require('@/assets/images/integrations/privateLabel.svg')" />
      <div class="price">
        <span class="uk-badge badge--transparent badge--outline badge--big">{{ $t('integrations.shared.free') }}</span>
      </div>
      <p class="description">{{ $t('integrations.components.privateLabel.description') }}</p>
    </div>

    <div class="integrations-actions">
      <button type="button" class="uk-button uk-button-primary" v-e2e="'activate'">
        {{ $t('integrations.shared.btn.activate') }}
      </button>
    </div>
  </core-drawer-content>
</template>

<script>
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';

export default {
  components: {
    CoreDrawerHeader,
    CoreDrawerContent,
  },
  props: {
    integrationId: Number,
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
  padding: $offcanvas-padding-y $offcanvas-padding-x;
  text-align: center;
}
.price {
  text-align: center;
  text-transform: uppercase;
}
.description {
  margin-bottom: 0;
  text-align: justify;
}
.icon {
  display: block;
  margin: 0 auto;
}
</style>
