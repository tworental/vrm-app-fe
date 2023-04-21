<template>
  <button
    type="button"
    @click="$emit('click')"
    class="onboarding-step btn--reset"
    :class="{ '--done': done, '--active': active }"
    v-e2e="'step'"
  >
    <span class="onboarding-step__num">
      <core-svg v-if="done" class="icon" width="14" :src="require('@/assets/images/icons/check.svg')" />
      <span v-else>{{ step }}</span>
    </span>
    <span class="onboarding-step__text">{{ $t('onboarding.dicts.' + langKey + '.title') }}</span>
  </button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
    },
    done: {
      type: Boolean,
    },
    step: {
      type: Number,
    },
    langKey: {
      type: String,
    },
  },
  emits: ['click'],
};
</script>

<style lang="scss" scoped>
.onboarding-step {
  $step: &;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1.15rem;
  cursor: pointer;
  outline: none;

  &,
  &:hover {
    color: $base-color-darken;
  }

  &__num {
    position: relative;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
    border: 1px solid rgba($base-color, 0.7);
    border-radius: 50%;
    text-align: center;
    line-height: 1.5rem;

    .icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &__text {
    text-transform: uppercase;
  }

  &.--done {
    &,
    &:hover:not(.--active) {
      color: rgba($base-color-darken, 0.3);
    }

    #{$step}__num {
      color: $color-white;
      background-color: $success-color;
      border-color: $success-color;
    }

    &.--active {
      #{$step}__num {
        border-color: $primary-color;
        background-color: $primary-color;
      }
    }
  }

  &.--active {
    color: $primary-color;

    #{$step}__num {
      border-color: currentColor;
    }
  }
}
</style>
