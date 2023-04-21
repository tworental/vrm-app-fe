<template>
  <div class="period-switch" @change="$emit('update:modelValue', $event.target.value)">
    <input
      id="toggle-on"
      class="toggle toggle-left"
      :value="BILLING_PERIODS.MONTHLY"
      type="radio"
      :checked="BILLING_PERIODS.MONTHLY === modelValue"
    />
    <label for="toggle-on" class="btn">
      {{ $t('billing.dicts.period.' + BILLING_PERIODS.MONTHLY) }}
    </label>
    <input
      id="toggle-off"
      class="toggle toggle-right"
      :value="BILLING_PERIODS.ANNUAL"
      type="radio"
      :checked="BILLING_PERIODS.ANNUAL === modelValue"
    >
    <label for="toggle-off" class="btn">
      <span>{{ $t('billing.dicts.period.' + BILLING_PERIODS.ANNUAL) }}</span>

      <span class="discount">
        {{ $t('billing.components.periodSwitcher.upTo', { num: '-10%' }) }}
      </span>
    </label>
  </div>
</template>

<script>
import { BILLING_PERIODS } from '@/modules/billing/services';

export default {
  name: 'BillingPeriodSwitcher',
  props: {
    modelValue: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    return {
      BILLING_PERIODS,
    };
  },
};
</script>

<style lang="scss" scoped>
.period-switch {
  display: inline-block;
  background-color: rgba($alt-color, 0.1);
  border-radius: 40px;
  padding: 5px 10px;
  z-index: 1;
}
.btn {
  display: inline-block;
  padding: 4px;
  position: relative;
  text-align: center;
  transition: background 600ms ease, color 600ms ease;
  border-radius: 40px;
  font-size: 0.875rem;
  font-weight: 700;
}

input[type="radio"].toggle {
  display: none;

  & + label {
    cursor: pointer;
    min-width: 140px;

    &:hover {
      background: none;
    }

    &:after {
      background: $primary-color;
      content: '';
      height: 100%;
      position: absolute;
      top: 0;
      transition: left 200ms cubic-bezier(0.77, 0, 0.175, 1);
      width: 100%;
      border-radius: 40px;
      z-index: -1;
    }
  }

  &.toggle-left + label {
    border-right: 0;

    &:after {
      left: 100%
    }
  }

  &.toggle-right + label {
    margin-left: -5px;

    &:after {
      left: -100%;
    }
  }

  &:checked + label {
    cursor: default;
    color: $color-white;
    transition: color 200ms;

    &:after {
      left: 0;
    }
  }
}
.discount {
  margin-left: 5px;
  background-color: rgba($base-color-darken, 0.5);
  color: $color-white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.75rem;
}
</style>
