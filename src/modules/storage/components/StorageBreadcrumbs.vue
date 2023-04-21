<template>
  <span class="core-layout-content-header__icon">
    <template v-for="{ key, location, icon } in locations" :key="key">
      <core-svg
        v-if="location === currentLocation"
        :width="20"
        :src="require(`@/assets/images/icons/${icon}.svg`)"
        class="icon"
      />
    </template>
  </span>

  <ul class="uk-breadcrumb">
    <li class="uk-breadcrumb__item">
      <router-link
        class="uk-breadcrumb__link"
        :to="{ name: 'storage-system', params: { location: currentLocation } }"
      >
        <h5 class="title">{{ $t('storage.shared.locations.' + currentLocation) }}</h5>
      </router-link>
    </li>
    <li class="uk-breadcrumb__item" v-for="(item, index) in data" :key="item.id">
      <template v-if="!item.custom">
        <router-link
          v-if="index < items.length - 1"
          class="uk-breadcrumb__link"
          :uk-tooltip="item.name.length > 17 ? 'pos: bottom;title: ' + item.name : 'title:'"
          :to="{ name: 'storage-system', params: { location: currentLocation, id: item.id } }"
        >
          {{ item.name }}
        </router-link>
        <span
          v-else
          class="uk-breadcrumb__link"
          :uk-tooltip="item.name.length > 17 ? 'pos: bottom;title: ' + item.name : 'title:'"
        >{{ item.name }}</span>
      </template>
      <span v-else class="uk-breadcrumb__link">...</span>
    </li>
  </ul>

  <span class="items-count">({{ itemsCount }})</span>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'StorageBreadcrumbs',
  props: {
    currentLocation: {
      type: String,
      required: true,
    },
    items: {
      type: Object,
      required: true,
    },
    itemsCount: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();

    const locations = computed(() => store.getters['storage/locations']);

    const data = computed(() => {
      if (props.items.length > 2) {
        return [
          { custom: true },
          props.items[props.items.length - 2],
          props.items[props.items.length - 1],
        ];
      }

      return props.items;
    });

    return { locations, data };
  },
};
</script>

<style lang="scss" scoped>
.folder-icon {
  margin-right: 10px;
}
.uk-breadcrumb {
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;

  &__link {
    color: rgba($base-color, 0.5);

    .title {
      display: inline-block;
      margin: 0;
      font-weight: 500;
    }
  }
  &__item {
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    max-width: 160px;

    &:nth-child(n+2):not(.uk-first-column)::before {
      margin: 0 10px;
    }
    .--current {
      color: $base-color-darken;
    }
    .uk-breadcrumb__link {
      display: block;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &:last-child {
      .uk-breadcrumb__link {
        color: $base-color-darken;
      }
    }
  }
}
.uk-dropdown {
  .uk-nav__link {
    padding-left: 0;
  }
}

.items-count {
  padding-left: 10px;
  color: rgba($alt-color, 0.7);
}
</style>
