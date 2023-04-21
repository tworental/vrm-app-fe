<template>
  <div class="progress-container">
    <span class="progress-hint">
      {{ $t('storage.components.capacity.label', { size: prettyBytes(size), maxSize: prettyBytes(maxSize), percent }) }}
    </span>
    <progress class="uk-progress uk-progress--primary" :value="size" :max="maxSize" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import * as prettyBytes from 'pretty-bytes';

export default {
  name: 'StorageCapacity',
  setup() {
    const store = useStore();

    const size = computed(() => store.state.storage.quota.size);
    const maxSize = computed(() => store.state.storage.quota.quota);
    const percent = computed(() => (
      Math.round((store.state.storage.quota.size * 100) / store.state.storage.quota.quota).toFixed(1)
    ));

    return {
      size, maxSize, percent, prettyBytes,
    };
  },
};
</script>

<style lang="scss" scoped>
.uk-progress {
  margin-top: 4px;
  height: 9px;
}

.progress {
  &-container {
    width: 220px;
    margin: 0.5rem 0;
  }
  &-hint {
    font-size: 0.65rem;
    color: rgba($base-color-darken, 0.7);
  }
}
</style>
