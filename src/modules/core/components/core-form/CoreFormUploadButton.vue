<template>
  <input
    :id="id"
    ref="inputRef"
    type="file"
    :multiple="multiple"
    class="uk-hidden"
    @change="onChange"
    v-e2e="'file'"
  />
  <button
    @click.prevent="onClick"
    class="uk-button uk-button-secondary"
    v-e2e
  >{{ label }}</button>
  <span class="uk-margin-left hint">{{ $t('core.components.upload.countSelected', { num: files.length }) }}</span>
</template>

<script>
import { ref } from 'vue';
import { useField } from 'vee-validate';

export default {
  name: 'CoreFormUploadButton',
  props: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    rules: {
      type: String,
    },
    multiple: {
      type: Boolean,
    },
  },
  setup(props) {
    const { handleChange } = useField(props.name, props.rules);

    const inputRef = ref(null);
    const files = ref([]);

    const onChange = (e) => {
      files.value = e.target.files;
      handleChange(props.multiple ? e.target.files : e.target.files[0]);
    };

    const onClick = () => inputRef.value.click();

    return {
      inputRef,
      files,
      onChange,
      onClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.hint {
  font-size: 0.75rem;
}
</style>
