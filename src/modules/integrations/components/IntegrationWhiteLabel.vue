<template>
  <core-drawer-header>{{ $t('integrations.components.whiteLabel.title') }}</core-drawer-header>
  <core-drawer-content>
    <div class="info">
      <core-svg class="icon" width="180" height="180" :src="require('@/assets/images/integrations/whiteLabel.svg')" />
      <div class="price">
        <span class="uk-badge badge--transparent badge--outline badge--big">{{ $t('integrations.shared.free') }}</span>
      </div>
      <p class="description">{{ $t('integrations.components.whiteLabel.description') }}</p>
    </div>

    <div class="integrations-actions">
      <div class="uk-flex uk-flex-between uk-margin-bottom">
        <p class="uk-margin-remove">custom.tworentals.com</p>
        <core-form-switcher />
      </div>
    </div>
  </core-drawer-content>
  <core-drawer-footer>
    <button
      type="button"
      @click="onClose"
      class="uk-button uk-button-link uk-margin-medium-right"
      v-e2e="'cancel'"
    >{{ $t('integrations.shared.btn.cancel') }}</button>
    <button type="submit" class="uk-button uk-button-success" v-e2e>{{ $t('integrations.shared.btn.save') }}</button>
  </core-drawer-footer>
</template>

<script>
import CoreSvg from '@/modules/core/components/CoreSvg.vue';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import useKit from '@/modules/core/composables/uikit';

export default {
  components: {
    CoreSvg,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormSwitcher,
  },
  props: {
    integrationId: Number,
  },
  setup() {
    const uikit = useKit();

    const onClose = () => {
      uikit.drawer.hide();
    };

    return { onClose };
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
  margin: 0 auto;
}
</style>
