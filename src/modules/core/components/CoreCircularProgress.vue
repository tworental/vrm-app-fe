<template>
  <div class="circular-progress">
    <div class="circle">
      <svg :width="circleSize" :height="circleSize" class="circle__svg">
        <circle
          :cx="centralPoint"
          :cy="centralPoint"
          :r="radius + 1"
          :style="{ 'stroke-width': strokeWidth, stroke: strokeColor }"
          class="circle__progress circle__progress--path"
        />
        <circle
          :cx="centralPoint"
          :cy="centralPoint"
          :r="radius + 1"
          :style="fileStyle"
          class="circle__progress circle__progress--fill"
        />
      </svg>

      <div class="percent" :style="{ color: textColor }">
        <span class="percent__int">{{ percent.int }}</span>
        <span class="dot" v-if="hasPercent">.</span>
        <span class="percent__dec" v-if="hasPercent">{{ percent.dec }}</span>
        <span class="percent_sign">%</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed, onBeforeUnmount, ref, watch, reactive,
} from 'vue';

export default {
  name: 'CoreCircularProgress',
  props: {
    strokeWidth: {
      type: Number,
      default: 4,
    },
    radius: {
      type: Number,
      default: 38,
    },
    transitionDuration: {
      type: Number,
      default: 1000,
    },
    strokeColor: {
      type: String,
      default: '#aaff00',
    },
    hasPercent: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '#aaff00',
    },
    value: {
      type: Number,
      validator(value) {
        // should be a number and less or equal than 100
        return !Number.isNaN(Number(value)) && Number(value) <= 100;
      },
      default: 0.0,
    },
  },
  setup(props, { slots }) {
    const offset = ref('');
    const intervalHandlers = ref({});
    const percent = reactive({
      int: 0,
      dec: '00',
    });
    const circumference = computed(() => props.radius * Math.PI * 2 + 4);
    const circleSize = computed(() => (props.radius + props.strokeWidth) * 2);
    const centralPoint = computed(() => circleSize.value / 2);

    const fileStyle = reactive({
      strokeDashoffset: offset.value,
      '--initialStroke': circumference.value,
      '--transitionDuration': `${props.transitionDuration}ms`,
      'stroke-width': props.strokeWidth,
      stroke: props.strokeColor,
    });

    const findClosestNumber = (bound, value) => {
      if (value <= bound) {
        return value;
      }
      return findClosestNumber(bound, value / 10);
    };

    const increaseNumber = (number, className) => {
      if (number === 0) {
        return;
      }
      const innerNum = parseInt(
        findClosestNumber(props.transitionDuration / 10, number), 10,
      );
      const interval = props.transitionDuration / innerNum;

      let counter = 0;
      const handlerName = `${className}Interval`;
      intervalHandlers[handlerName] = setInterval(() => {
        const bitDiff = number.toString().length - innerNum.toString().length;
        if (bitDiff === 0) {
          percent[className] = counter;
        } else {
          percent[className] = counter * 10 * bitDiff;
        }
        if (counter === innerNum) {
          // back to origin precision
          percent[className] = number;
          window.clearInterval(intervalHandlers[handlerName]);
        }
        counter += 1;
      }, interval);
    };

    let initTimeoutHandler = null;

    const countNumber = (v) => {
      offset.value = '';

      initTimeoutHandler = setTimeout(() => {
        offset.value = (circumference.value * (100 - v)) / 100;
        fileStyle.strokeDashoffset = offset.value;
      }, 100);
      if (slots.default) return;
      let [int, dec] = v.toString().split('.');

      // fallback for NaN
      [int, dec] = [Number(int), Number(dec)];
      increaseNumber(int, 'int');
      increaseNumber(Number.isNaN(dec) ? 0 : dec, 'dec');
    };

    const clearHandlers = () => {
      if (initTimeoutHandler) {
        clearTimeout(initTimeoutHandler);
      }
      if (intervalHandlers.value.intInterval) {
        clearInterval(intervalHandlers.value.intInterval);
      }
      if (intervalHandlers.value.decInterval) {
        clearInterval(intervalHandlers.value.decInterval);
      }
    };

    watch(() => props.value, (v) => {
      const n = Number(v);
      if (Number.isNaN(n) || n === 0) {
        return;
      }
      clearHandlers();
      countNumber(v);
    }, { immediate: true });

    onBeforeUnmount(() => {
      clearHandlers();
    });

    return {
      centralPoint,
      fileStyle,
      circleSize,
      percent,
      offset,
    };
  },
};
</script>

<style lang="scss" scoped>
$--circular-progress-int-fz: 28px;
$--circular-progress-dec-fz: 12px;

.uk-inline a {
  .percent {
    font-weight: 500;
  }

  .percent__int {
    font-size: 10px;
  }

  .percent_sign {
    font-size: 8px;
  }
}

.circular-progress {
  display: inline-block;

  .circle {
    position: relative;
  }

  .circle__svg {
    transform: rotate(-90deg);
  }

  .circle__progress {
    fill: none;
    stroke-opacity: 0.3;
    stroke-linecap: round;
  }

  .circle__progress--fill {
    --initialStroke: 0;
    --transitionDuration: 0;
    stroke-opacity: 1;
    stroke-dasharray: var(--initialStroke);
    stroke-dashoffset: var(--initialStroke);
    transition: stroke-dashoffset var(--transitionDuration) ease;
  }

  .percent {
    width: 100%;
    top: 50%;
    left: 50%;
    position: absolute;
    font-weight: bold;
    text-align: center;
    line-height: $--circular-progress-int-fz;
    transform: translate(-50%, -50%);
  }

  .percent__int {
    font-size: $--circular-progress-int-fz;
  }

  .percent__dec,
  .percent_sign {
    font-size: $--circular-progress-dec-fz;
  }

  .label {
    font-size: 14px;
    text-transform: uppercase;
    margin-top: 15px;
  }
}
</style>
