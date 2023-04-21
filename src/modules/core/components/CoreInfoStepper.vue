<template>
  <ul class="info-stepper">
    <li v-for="item in steps" :key="item" class="step">
      <div class="step__num">{{ item }}</div>
      <div class="step__content">
        <slot :name="'step-' + item"></slot>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'CoreInfoStepper',
  props: {
    steps: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style lang="scss" scoped>
.info-stepper {
  list-style: none;
  padding: 0;
  margin: 0;
}
.step {
  position: relative;
  display: flex;
  align-items: flex-start;

  &__num {
    position: absolute;

    margin-right: 20px;
    height: 28px;
    width: 28px;
    min-width: 28px;
    flex-basis: 28px;
    background-color: $color-white;
    line-height: 29px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid rgba($base-color, 0.3);
  }
  &__content {
    padding-left: 28px;
    margin-left: 15px;
    padding-bottom: 1rem;
    border-left: 1px solid rgba($base-color, 0.3);
  }

  &:last-child {
    .step {
      margin-bottom: 0;
    }
    .step__content {
      padding-bottom: 0;
      border-left: none;
    }
  }
}
</style>
