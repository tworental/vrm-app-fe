<template>
  <core-drawer-header>{{ $t('integrations.components.stripe.title') }}</core-drawer-header>
  <core-drawer-content>
    <div class="info">
      <core-svg
        class="icon --no-stroke"
        height="120"
        :src="require('@/assets/images/integrations/stripe.svg')"
      />
      <div class="price">
        <span class="uk-badge badge--transparent badge--outline badge--big">{{ $t('integrations.shared.free') }}</span>
      </div>
      <p class="description">{{ $t('integrations.components.stripe.description') }}</p>
    </div>

    <div class="integrations-actions">
      <button type="button" class="uk-button uk-button-primary" v-e2e="'activate'">
        {{ $t('integrations.shared.btn.activate') }}
      </button>
    </div>
  </core-drawer-content>
</template>

<script>
import CoreSvg from '@/modules/core/components/CoreSvg.vue';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';

export default {
  components: {
    CoreSvg,
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
  margin: 30px auto;
}
</style>
