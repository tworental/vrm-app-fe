<template>
  <core-drawer-header>{{ $t('integrations.components.zapier.title') }}</core-drawer-header>
  <core-drawer-content>
    <div class="info">
      <core-svg
        class="icon --no-stroke"
        height="130"
        :src="require('@/assets/images/integrations/zapier.svg')"
      />
      <div class="price">
        <span class="uk-badge badge--transparent badge--outline badge--big">{{ $t('integrations.shared.free') }}</span>
      </div>
      <p class="description">{{ $t('integrations.components.zapier.description.0') }}</p>
    </div>

    <div class="integrations-actions">
      <div>
        <p>{{ $t('integrations.components.zapier.description.1') }}</p>
        <p>{{ $t('integrations.components.zapier.description.2') }}</p>

        <core-copy-clipboard-label
          :label="$t('integrations.components.zapier.key')"
          value="AIXSsdasDESddddddddddddddddddddddasdDss"
        />

        <p>{{ $t('integrations.components.zapier.description.3') }}</p>
      </div>
    </div>
  </core-drawer-content>
</template>

<script>
import CoreSvg from '@/modules/core/components/CoreSvg.vue';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreCopyClipboardLabel from '@/modules/core/components/CoreCopyClipboardLabel.vue';

export default {
  components: {
    CoreSvg,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreCopyClipboardLabel,
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
