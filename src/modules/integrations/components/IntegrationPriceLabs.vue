<template>
  <core-drawer-header>{{ $t('integrations.components.priceLabs.title') }}</core-drawer-header>
  <core-drawer-content>
    <div class="info">
      <core-svg
        class="icon --no-stroke"
        height="100"
        width="180"
        :src="require('@/assets/images/integrations/priceLabs.svg')"
      />
      <div class="price">
        <span class="uk-badge badge--transparent badge--outline badge--big">{{ $t('integrations.shared.free') }}</span>
      </div>
      <p class="description">{{ $t('integrations.components.priceLabs.description.0') }}</p>
    </div>

    <div class="integrations-actions">
      <h5>{{ $t('integrations.components.priceLabs.stepsToConnect') }}</h5>

      <core-info-stepper :steps="4">
        <template v-slot:step-1>
          <p class="uk-text-small uk-margin-remove">
            {{ $t('integrations.components.priceLabs.description.1') }}
          </p>
        </template>
        <template v-slot:step-2>
          <p class="uk-text-small uk-margin-small-bottom">
            {{ $t('integrations.components.priceLabs.description.2') }}
          </p>
          <div class="uk-margin-small-bottom">
            <core-copy-clipboard-label
              :label="$t('integrations.components.priceLabs.userId')"
              value="2333"
            />
          </div>
          <div>
            <core-copy-clipboard-label
              :label="$t('integrations.components.priceLabs.appKey')"
              value="4234dsasdas342DAxdas"
            />
          </div>
        </template>
        <template v-slot:step-3>
          <p class="uk-text-small uk-margin-small-bottom">
            {{ $t('integrations.components.priceLabs.description.3') }}
          </p>
          <button class="uk-button uk-button-primary" v-e2e="'rates'">
            {{ $t('integrations.components.priceLabs.goToExternalRates') }}
          </button>
        </template>
        <template v-slot:step-4>
          <p class="uk-text-small uk-margin-remove">
            <strong>{{ $t('integrations.components.priceLabs.description.4') }}</strong>
          </p>
          <p class="uk-text-small uk-margin-remove">
            {{ $t('integrations.components.priceLabs.description.5') }}
          </p>
        </template>
      </core-info-stepper>
    </div>
  </core-drawer-content>
</template>

<script>
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreCopyClipboardLabel from '@/modules/core/components/CoreCopyClipboardLabel.vue';
import CoreInfoStepper from '@/modules/core/components/CoreInfoStepper.vue';

export default {
  components: {
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreCopyClipboardLabel,
    CoreInfoStepper,
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
