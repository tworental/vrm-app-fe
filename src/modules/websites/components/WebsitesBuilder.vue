<template>
  <div ref="builderRef" />
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import grapesjs from 'grapesjs';

export default {
  setup() {
    const builderRef = ref(null);

    let editor;

    /**
     * On mounted component
     */
    onMounted(() => {
      editor = grapesjs.init({
        container: builderRef.value,
        fromElement: true,
        height: '100%',
        blockManager: {
          appendTo: '#blocks',
          blocks: [
            {
              id: 'text',
              label: 'Text',
              content: '<div data-gjs-type="text">Insert your text here</div>',
            },
          ],
        },
      });
    });

    /**
     * On before unmount component
     */
    onBeforeUnmount(() => {
      if (editor) {
        editor.destroy();
      }
    });

    return { builderRef };
  },
};
</script>

<style lang="scss" scoped>
  @import "~grapesjs/dist/css/grapes.min.css";
  // @import "~grapesjs/src/styles/scss/main.scss";

  ::v-deep() {
    .gjs-two-color {
      background: #3E3F42;
    }
    .gjs-cv-canvas {
      top: 0;
      width: 100%;
      height: 100%;
    }

    .gjs-block {
      width: auto;
      height: auto;
      min-height: auto;
    }

    [data-highlightable] {
      outline: none;
    }
  }
</style>
