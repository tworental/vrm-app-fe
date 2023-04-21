<template>
  <div class="room-type">
    <div class="room-type__name">
      <core-svg
        :width="24"
        :src="require('@/assets/images/icons/rentals/' + icon + '.svg')"
        class="uk-margin-small-right --no-stroke"
      />
      <span>{{ name }}</span>
    </div>
    <div class="room-type__meta" v-if="meta">{{ qty }}</div>
    <button
      type="button"
      class="room-type__delete"
      :class="{ 'uk-margin-left-auto': !meta }"
      @click.prevent="$emit('delete')"
    >
      <core-svg
        :width="20"
        :src="require('@/assets/images/icons/delete.svg')"
      />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    name: {
      type: String,
    },
    qty: {
      type: Number,
    },
    meta: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['delete'],
};
</script>
