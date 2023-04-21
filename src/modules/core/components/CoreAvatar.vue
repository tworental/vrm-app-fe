<template>
  <div class="avatar-wrapper" :style="wrapperStyle" aria-hidden="true">
    <div class="avatar-wrapper__image" :style="contentStyle">
      <img v-if="hasImage" :src="src" @error="imgError = true" class="avatar-wrapper__image--d-none"/>
      <span v-else>{{ initials }}</span>
    </div>
  </div>
</template>

<script>
import {
  computed,
  onUpdated,
  ref,
} from 'vue';
import Color from 'color';

export default {
  name: 'CoreAvatar',
  props: {
    username: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 50,
    },
    src: {
      type: String,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    lighten: {
      type: Number,
      default: 80,
    },
    color: {
      type: String,
    },
    borderColor: {
      type: String,
    },
    colors: {
      type: Array,
      default: () => [
        '#F44336',
        '#FF4081',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B',
      ],
    },
  },
  setup(props) {
    const imgError = ref(false);

    const hasImage = computed(() => !imgError.value && Boolean(props.src));
    const initials = computed(() => props.username.split(' ').map((letters) => letters.charAt(0)).join('').substr(0, 2)
      .toUpperCase());

    const color = computed(() => props.color || props.colors[props.username.length % props.colors.length]);

    const wrapperStyle = ref({
      width: `${props.size}px`,
      height: `${props.size}px`,
      borderRadius: props.rounded ? '50%' : 0,
    });

    const contentStyle = ref({
      lineHeight: `${props.size + Math.floor(props.size / 20)}px`,
      backgroundColor: color.value,
      color: Color(color.value).lighten(props.lighten / 100).hex(),
      font: `${Math.floor(props.size / 2.5)}px/${props.size}px Helvetica, Arial, sans-serif`,
      borderRadius: props.rounded ? '50%' : 0,
      width: '100%',
      height: '100%',
    });

    if (props.borderColor) {
      wrapperStyle.value.border = `1px solid ${props.borderColor}`;
      wrapperStyle.value.padding = '3px';
    }

    if (hasImage.value) {
      contentStyle.value.background = `${color.value} url('${props.src}') no-repeat scroll 0% 0% / ${props.size}px ${props.size}px content-box border-box`;
    }

    onUpdated(() => {
      imgError.value = !props.src;

      if (hasImage.value) {
        contentStyle.value.background = `${color.value} url('${props.src}') no-repeat scroll 0% 0% / ${props.size}px ${props.size}px content-box border-box`;
      } else {
        contentStyle.value.background = `${color.value} no-repeat scroll 0% 0% / ${props.size}px ${props.size}px content-box border-box`;
      }
    });

    return {
      imgError,
      hasImage,
      initials,
      wrapperStyle,
      contentStyle,
    };
  },
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-align: center;
  user-select: none;
  outline: none;
  box-sizing: content-box;

  &__image {
    &--d-none {
      display: none;
    }
  }
}
</style>
