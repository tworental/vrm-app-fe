<template>
  <span>{{ formattedTime }}</span>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  name: 'CoreCountdown',
  props: {
    time: Number,
  },
  emits: ['end'],
  setup(props, { emit }) {
    const timer = ref(props.time);

    const formattedTime = computed(() => {
      const minutes = `0${Math.floor(timer.value / 60)}`.slice(-2);
      const seconds = `0${Math.floor(timer.value % 60)}`.slice(-2);

      return `${minutes}:${seconds}`;
    });

    const interval = setInterval(() => {
      if (timer.value === 0) {
        emit('end');
        clearInterval(interval);
      } else {
        timer.value -= 1;
      }
    }, 1000);

    return { timer, formattedTime };
  },
};
</script>
