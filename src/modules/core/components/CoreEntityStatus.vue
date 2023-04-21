<template>
  <span class="uk-flex">
    <span class="uk-badge badge--danger" v-if="entity.lockedAt">
      {{ $t('core.components.entityStatus.locked') }}
    </span>
    <span class="uk-badge badge--warn" v-else-if="!entity.confirmedAt">
      {{ $t('core.components.entityStatus.pending') }}
    </span>
    <span class="uk-badge badge--success" v-else>
      {{ $t('core.components.entityStatus.confirmed') }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'CoreEntityStatus',
  props: {
    entity: {
      type: Object,
    },
  },
};
</script>
