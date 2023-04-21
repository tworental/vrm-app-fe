<template>
  <div aria-hidden="true">
    <img v-if="hasImage" :src="src" @error="imgError = true" />
    <img v-else :src="fallback" :class="{ 'img-placeholder': grayPlaceholder }" />
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
  name: 'CoreImage',
  props: {
    src: {
      type: String,
      required: true,
    },
    fallback: {
      type: String,
      required: true,
    },
    grayPlaceholder: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const imgError = ref(false);
    const hasImage = computed(() => !imgError.value && Boolean(props.src));

    watch(() => props.src, () => {
      imgError.value = false;
    });

    return {
      imgError,
      hasImage,
    };
  },
};
</script>
