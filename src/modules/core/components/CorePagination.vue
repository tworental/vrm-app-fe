<template>
  <div class="uk-flex uk-flex-middle">
    <div class="uk-padding-small uk-padding-remove-vertical pages">
      {{ range.from }}-{{ range.to }}
      <span class="meta">{{ $t('core.components.pagination.of') }}</span>
      {{ total }}
    </div>
    <div class="uk-flex uk-flex-stretch">
      <button
        type="button"
        class="uk-button uk-button--has-icon"
        :disabled="page === 1 || disabled"
        @click="onPrev"
        v-e2e="'prev'"
      >
        <core-svg :width="16" :src="require('@/assets/images/icons/page-prev.svg')" />
      </button>
      <div class="pages-container pages">
        <button
          type="button"
          class="btn"
          :class="{'--current': page === item.value }"
          v-for="(item, index) in pages"
          :key="index"
          :disabled="!item.clickable || disabled"
          @click="onGo(item.value)"
          v-e2e="'page-' + item.value"
        >
          {{ item.value }}
        </button>
      </div>

      <button
        type="button"
        class="uk-button uk-button--has-icon"
        :disabled="page === lastPage || disabled"
        @click="onNext"
        v-e2e="'next'"
      >
        <core-svg :width="16" :src="require('@/assets/images/icons/page-next.svg')" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'CorePagination',
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 9,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const page = ref(props.currentPage);

    const lastPage = computed(() => Math.ceil(props.total / props.perPage));
    const range = computed(() => ({
      from: (page.value - 1) * props.perPage + 1,
      to: Math.min(page.value * props.perPage, props.total),
    }));

    const onPrev = () => {
      page.value = Math.max(page.value - 1, 1);

      emit('change', page.value);
    };

    const onNext = () => {
      page.value = Math.min(page.value + 1, lastPage.value);

      emit('change', page.value);
    };

    const onGo = (value) => {
      page.value = value;

      emit('change', page.value);
    };

    const setPages = (start, end) => {
      const begin = start > 0 ? start : 1;
      const len = end - begin + 1;

      return new Array(len).fill(begin).map((_, index) => ({
        value: begin + index,
        clickable: true,
      }));
    };

    const pages = computed(() => {
      const total = lastPage.value;

      if (total <= props.max) {
        return setPages(1, total);
      }

      const even = props.max % 2 === 0 ? 1 : 0;

      let prevRange;

      if (total < 6) {
        prevRange = Math.floor(props.max / (props.max / 2));
      } else {
        prevRange = Math.floor(props.max / 2);
      }

      const nextRange = total - prevRange + 1 + even;

      if (page.value >= prevRange && page.value <= nextRange) {
        const start = page.value - prevRange + 2;
        const end = page.value + prevRange - 2 - even;
        return [
          { value: 1, clickable: true },
          { value: '...', clickable: false },
          ...setPages(start, end),
          { value: '...', clickable: false },
          { value: total, clickable: true },
        ];
      }

      if (total < 6) {
        return setPages(1, total);
      }

      return [
        ...setPages(1, prevRange),
        { value: '...', clickable: false },
        ...setPages(nextRange, total),
      ];
    });

    return {
      page,
      lastPage,
      range,
      pages,

      onPrev,
      onNext,
      onGo,
    };
  },
};
</script>

<style lang="scss" scoped>
.current-page {
  border-top: 1px solid rgba($base-color, 0.2);
  border-bottom: 1px solid rgba($base-color, 0.2);
  padding-left: 10px;
  padding-right: 10px;
  min-width: 60px;
  text-align: center;
  line-height: 36px;
  background-color: $color-white;
  user-select: none;
}
.meta {
  color: rgba($base-color-darken, 0.5);
}
.pages {
  font-size: 0.75rem;

  @include fromTablet {
    font-size: 0.875rem;
  }
}
.pages-container {
  border: 1px solid rgba($base-color, 0.2);
  margin: 0 10px;
  background-color: $color-white;

  .btn {
    background: none;
    border: none;
    outline: none;
    width: 38px;
    height: 100%;
    cursor: pointer;

    &.--current {
      background-color: $primary-color;
      color: $color-white;
    }
  }
}
</style>
