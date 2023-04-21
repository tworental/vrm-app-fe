<template>
  <div class="table__footer" v-if="totalSelectedItems > 0">
    <core-form-checkbox @change="toggleItems($event)" class="select-all" label="storage.views.drive.selectAll" />

    <span class="uk-badge">
      <span>{{ $t('storage.views.drive.selected', { count: totalSelectedItems }) }}</span>
    </span>

    <button v-if="!isBinDirectory" class="uk-button uk-button--has-icon --from-tablet">
      <core-svg :width="24" :src="require('@/assets/images/icons/download.svg')" />
    </button>
    <button v-else class="uk-button uk-button--has-icon --from-tablet">
      <core-svg :width="24" :src="require('@/assets/images/icons/revert.svg')" />
    </button>

    <button class="uk-button uk-button--has-icon --from-tablet" @click="deleteSelectedItems">
      <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
    </button>

    <button class="uk-button uk-button--with-icon uk-text-uppercase --transparent --close">
      <core-svg :width="18" :src="require('@/assets/images/icons/close.svg')" />
    </button>
  </div>

  <footer class="footer-toolbar --to-tablet">
    <button class="uk-button uk-button-text" @click="deleteSelectedItems">
      <core-svg class="icon" :width="24" :src="require('@/assets/images/icons/delete.svg')" />
      <span class="btn-label uk-display-block">{{ $t('storage.views.drive.delete') }}</span>
    </button>

    <button class="uk-button uk-button-text">
      <core-svg class="icon" :width="24" :src="require('@/assets/images/icons/upload.svg')" />
      <span class="btn-label uk-display-block">{{ $t('storage.views.drive.upload') }}</span>
    </button>

    <button v-if="!isBinDirectory" class="uk-button uk-button-text">
      <core-svg class="icon" :width="24" :src="require('@/assets/images/icons/download.svg')" />
      <span class="btn-label uk-display-block">{{ $t('storage.views.drive.download') }}</span>
    </button>
    <button v-else class="uk-button uk-button-text">
      <core-svg class="icon" :width="24" :src="require('@/assets/images/icons/revert.svg')" />
      <span class="btn-label uk-display-block">{{ $t('storage.views.drive.revert') }}</span>
    </button>
  </footer>
</template>

<script>
import { computed } from 'vue';
import { mapActions, useStore } from 'vuex';

import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';

export default {
  name: 'StorageFooterBar',
  components: {
    CoreFormCheckbox,
  },
  setup() {
    const store = useStore();

    const totalSelectedItems = computed(() => store.getters['storage/totalSelectedItems']);
    const isBinDirectory = computed(() => store.getters['storage/isBinDirectory']);

    return {
      ...mapActions('storage', [
        'toggleItems',
        'deleteSelectedItems',
      ]),

      totalSelectedItems,
      isBinDirectory,
    };
  },
};
</script>

<style lang="scss" scoped>
.table__footer {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  border-top: 1px solid rgba(map-get($theme-colors , 'alternative'), .4);

  @include toTablet {
    justify-content: space-between;
  }

  & > * {
    margin-right: 8px;

    @include fromWideMobile {
      margin-right: 18px;
    }

    @include fromTablet {
      margin-right: 25px;
    }

    @include toWideMobile {
      font-size: 12px;
    }

    &.--close {
      margin-left: auto;
      margin-right: 0;
    }
  }
}

.select-all {
  text-transform: uppercase;
}

.footer-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-top: 1px solid rgba(map-get($theme-colors , 'alternative'), .2);

  .icon {
    color: $base-color-darken;
  }

  .btn-label {
    color: rgba($base-color-darken, 0.6);
    font-weight: 500;
  }
}

.uk-badge {
  padding: 0 10px;

  &__num {
    padding-right: 6px;
  }
}
</style>
