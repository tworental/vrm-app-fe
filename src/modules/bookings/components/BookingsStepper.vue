<template>
  <div class="bookings-stepper">
    <button
      v-for="(step, idx) in steps"
      :key="idx"
      class="bookings-stepper__step"
      :class="{ '--current': modelValue === step.value, '--done': step.done }"
      type="button"
      v-e2e="'step'"
      :disabled="step.disabled"
      @click="$emit('update:modelValue', step.value)"
    >
      <div>
        {{ step.label }}
      </div>

      <div class="bookings-stepper__step-circle">
        <core-svg
          :width="10"
          :src="require('@/assets/images/icons/check.svg')"
        />
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'BookingsStepper',
  props: {
    steps: {
      type: Array,
    },
    modelValue: {
      type: Number,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style lang="scss" scoped>
.bookings-stepper {
  display: flex;
  align-items: center;
  justify-content: space-around;

  &__step {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 0.875rem;
    text-align: center;
    position: relative;
    flex: 1;
    color: rgba($alt-color, 0.5);

    &:first-child::before,
    &:last-child::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: $stepper-background-color;
      top: 35px;
      left: 0;
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: $stepper-background-color;
      top: 35px;
      left: 50%;
      z-index: 2;
    }

    &-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      color: $color-white;
      background-color: $stepper-background-color;
      margin: 10px auto;
      z-index: 3;
      position: relative;
    }

    &.--done {
      color: $base-color-darken;

      &::after,
      &::before {
        background-color: $success-color;
      }

      .bookings-stepper__step-circle {
        background-color: $success-color;
        color: $color-white;
      }
    }
    &.--current {
      color: $base-color-darken;

      .bookings-stepper__step-circle {
        background-color: $primary-color;
        color: $color-white;
      }
    }

    &:disabled {
      color: rgba($alt-color, 0.5);
    }
  }
}
</style>
