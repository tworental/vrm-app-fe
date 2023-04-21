<template>
  <button
    class="uk-button copy-clipboard"
    :class="{ '--clicked': clicked }"
    @click.prevent="onCopy"
  >
    <span class="copy-clipboard__icon">
      <core-svg width="20" :src="require('@/assets/images/icons/copy-paste.svg')" />
    </span>
    <span class="copy-clipboard__label">{{ label }}</span>
    <span class="copy-clipboard__label --only-hover">{{ value }}</span>
  </button>
</template>

<script>
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

import useKit from '@/modules/core/composables/uikit';

export default {
  name: 'CoreCopyClipboardLabel',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const uikit = useKit();
    const { copy } = useClipboard();

    const clicked = ref(false);

    const onCopy = async () => {
      clicked.value = true;

      copy(props.value);

      uikit.notify('success', `${props.label} has been copied successfully`);

      setTimeout(() => {
        clicked.value = false;
      }, 2000);
    };

    return {
      clicked,
      onCopy,
    };
  },
};
</script>

<style lang="scss" scoped>
.copy-clipboard {
  $self: &;

  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: $color-white;
  border: 1px solid rgba($base-color, 0.1);
  width: 100%;
  transition: all 0.05s linear;

  &__icon {
    margin-right: auto;
  }
  &__label {
    width: 100%;
    text-align: right;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 20px;

    &.--only-hover {
      display: none;
    }
  }
  &.--clicked {
    border-color: $success-color;
    color: $success-color;
  }
  &:hover {
    background-color: rgba($base-color, 0.03);

    #{$self}__label {
      display: none;

      &.--only-hover {
        display: inline-block;
      }
    }
  }
}
</style>
