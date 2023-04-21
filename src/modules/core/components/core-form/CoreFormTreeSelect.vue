<template>
  <TreeSelect
    v-model="selectedNodeKey"
    :options="nodes"
    :placeholder="$t('core.components.select.select')"
    class="uk-width-1-1"
    :selectionMode="selectionMode"
    @node-expand="onNodeExpand"
    @update:modelValue="onChange"
    appendTo="self"
  />
</template>

<script>
import { ref } from 'vue';
import TreeSelect from 'primevue/treeselect';
import { useField } from 'vee-validate';

export default {
  name: 'CoreFormTreeSelect',
  components: { TreeSelect },
  emits: ['node-expand'],
  props: {
    nodes: Array,
    name: String,
    value: Object,
    selectionMode: String,
  },
  setup(props, { emit }) {
    const { handleChange } = useField(props.name);

    const selectedNodeKey = ref(props.value || null);
    const cache = ref({});

    const onNodeExpand = (event) => {
      if (!cache.value[event.key]) {
        emit('node-expand', event);
      }

      cache.value[event.key] = true;
    };

    const onChange = (event) => handleChange(event);

    return {
      selectedNodeKey,
      cache,

      onNodeExpand,
      onChange,
    };
  },
};
</script>

<style scoped>

</style>
