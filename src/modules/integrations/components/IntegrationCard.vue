<template>
  <div
    class="uk-card uk-card-default card-grid-view"
    :class="{ '--disabled': !integration.enabled }"
    @click="$emit('click')"
  >
    <div class="uk-card__wrapper">
      <div class="uk-card__figure">
        <core-svg
          width="150"
          height="150"
          class="img --no-stroke"
          :src="require('@/assets/images/integrations/' + integration.name + '.svg')"
        />
      </div>
      <div class="uk-card-body">
        <span class="uk-badge badge--primary" v-if="integration.enabled">
          <span class="status-text">{{ $t('integrations.components.card.status.activated') }}</span>
          <core-svg width="8" :src="require('@/assets/images/icons/check.svg')" />
        </span>
        <span class="uk-badge badge--light" v-else>{{ $t('integrations.components.card.status.disabled') }}</span>
        <span
          class="uk-badge badge--transparent badge--outline"
        >{{ integration.unitAmount || $t('integrations.shared.free') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['click'],
  props: {
    integration: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.uk-card {
  background-color: $color-white;
  border: none;

  &__figure {
    --card-grid-ratio: 80%;

    background-color: $color-white;

    &__img {
      stroke: none;
    }
    .img {
      width: 100%;
      height: 100%;
      padding: 20px;
    }
  }
  &__wrapper {
    box-shadow: 0 0 0 1px rgba($alt-color, .2);
  }
  &-body {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
}
.status-text {
  padding-right: 5px;
}
</style>
