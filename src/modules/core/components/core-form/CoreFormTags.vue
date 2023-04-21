<template>
  <div>
    <select ref="selectRef" multiple @change="onChange">
    </select>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { create } from '@/utils/choices';

export default {
  name: 'CoreFormTags',
  props: {
    name: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    rules: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
    },
    data: {
      type: Array,
    },
    onlyAutocomplete: {
      type: Boolean,
      default: false,
    },
    noItemsLabel: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const i18n = useI18n();
    const { handleChange } = useField(props.name, props.rules, { initialValue: props.value });

    const selectRef = ref(null);

    const onChange = (e) => {
      const values = Array.from(e.target.options).map(({ value }) => value);

      handleChange(values);
    };

    onMounted(() => {
      const el = create(selectRef.value, {
        choices: props.data.map((item) => ({
          ...item,
          selected: props.value?.includes(item.value),
        })),
        searchEnabled: false,
        itemSelectText: i18n.t('core.components.select.press'),
        loadingText: '',
        noChoicesText: i18n.t('core.components.tags.noItems'),
        noResultsText: i18n.t('core.components.tags.noItems'),
      });
      el.input.element.placeholder = props.placeholder;
    });

    return {
      selectRef,
      onChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.tag-input {
  width: 100%;
  border: 1px solid rgba($alt-color, 0.3);
  font-size: 0.75rem;
  box-sizing: border-box;
  padding: 0 10px;
  position: relative;
  cursor: text;
}

.no-data {
  padding: 0 10px 5px;
  color: $input-placeholder-color;
  user-select: none;
  pointer-events: none;
}

.tag-input__tag {
  height: 24px;
  float: left;
  margin-right: 5px;
  background-color: rgba($alt-color, 0.3);
  margin-top: 7px;
  line-height: 24px;
  padding: 0 5px;
  border-radius: 5px;
}

.tag-input__tag > span {
  cursor: pointer;
  opacity: 0.75;
}

.tag-input__text {
  border: none;
  outline: none;
  font: inherit;
  line-height: 38px;
  padding: 0;
  background: none;

  &::-ms-input-placeholder { color: $input-placeholder-color !important; }
  &::placeholder { color: $input-placeholder-color; }

}
.dropdown {
  position: absolute;
  right: -1px;
  left: -1px;
  background-color: $color-white;
  border: 1px solid rgba($alt-color, 0.3);
  border-top: none;
  z-index: 3;
  max-height: 200px;
  box-sizing: border-box;
  overflow: auto;
  box-shadow: 0 5px 10px 0 rgba($base-color-darken,0.1);

  .uk-button {
    font-size: 0.75rem;
    padding: 4px 7px;
    color: $base-color-darken;
    line-height: 25px;

    &:hover {
      background-color: rgba($base-color-darken,0.05);
    }

    &:focus {
      background-color: rgba($alt-color, 0.1);
    }
  }
}
</style>
