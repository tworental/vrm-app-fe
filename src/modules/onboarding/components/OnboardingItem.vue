<template>
  <div class="onboarding-item">
    <div class="onboarding-item__circle" :class="{ '--completed': completed }"></div>
    <div class="onboarding-item__info">
      <h4 class="onboarding-item__title">{{ $t('onboarding.dicts.' + langKey + '.title') }}</h4>
      <p class="onboarding-item__description">{{ $t('onboarding.dicts.' + langKey + '.description') }}</p>
    </div>
    <div class="onboarding-item__status">
      <button
        type="button"
        v-if="!completed"
        class="uk-button uk-button-primary"
        @click="$emit('complete')"
        v-e2e="'complete'"
      >
        {{ $t('onboarding.components.item.complete') }}
      </button>
      <span v-else class="uk-badge badge--success">
        {{ $t('onboarding.components.item.completed') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    completed: {
      type: Boolean,
    },
    langKey: {
      type: String,
    },
  },
  emits: ['complete'],
};
</script>

<style lang="scss" scoped>
.onboarding-item {
  display: flex;
  align-items: flex-start;
  margin: 1.5rem 0;
  flex-wrap: wrap;

  @include fromWideMobile {
    flex-wrap: nowrap;
  }

  &__info {
    flex-basis: 90%;

    @include fromWideMobile {
      flex-basis: unset;
    }
  }
  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: $base-color-darken;
    margin: 0;
  }
  &__description {
    margin-top: 0.4rem;
    margin-right: 1rem;
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
    color: rgba($base-color-darken, 0.7);
  }
  &__status {
    margin-left: 17px;
    @include fromWideMobile {
      margin-left: auto;
    }
  }
  &__circle {
    min-width: 10px;
    min-height: 10px;
    border-radius: 50%;
    background-color: rgba($base-color-darken, 0.2);
    margin-top: 7px;
    margin-right: 7px;

    &.--completed {
      background-color: $success-color;
    }
  }
}
</style>
