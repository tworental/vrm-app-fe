<template>
  <div class="uk-inline">
    <button
      class="navbar__button uk-button uk-button-text"
      type="button"
      v-e2e="'menu'"
      @click="onOpenSidebar"
    >
      <core-avatar
        :size="32"
        :username="user.fullName || user.email"
        :src="user.avatar"
        color="#504B41"
        borderColor="#5A80F9"
      />
    </button>

    <div ref="sidebar" class="sidebar" uk-offcanvas="flip: true">
      <div class="uk-offcanvas-bar sidebar-bg">
        <div>
          <button
            class="uk-offcanvas-close"
            type="button"
            uk-close
            v-e2e="'close'"
          ></button>
        </div>
        <div>
          <div class="uk-card-header core-nav-avatar-card__header">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
              <div class="uk-width-auto">
                <core-avatar
                  :size="45"
                  :username="user.fullName || user.email"
                  :src="user.avatar"
                  color="#515255"
                  borderColor="#5A80F9"
                />
              </div>
              <div class="uk-width-expand">
                <h3 class="uk-card-title uk-margin-remove-bottom core-user-card__name">
                  {{ user.fullName || user.email }}
                </h3>
                <p v-if="user.fullName" class="core-user-card__email">{{ user.email }}</p>
              </div>
              <div
                class="uk-width-auto"
                v-access="{ limits, name: LIMITS.APP_ONBOARDING_ENABLED, user, acl: MODULES.ONBOARDING }"
              >
                <core-nav-setup-progress-btn />
              </div>
            </div>
          </div>

          <ul class="uk-nav" @click="onCloseSidebar">
            <template v-for="(menuItems, idx) in menu" :key="idx">
              <li v-for="(item, menuIdx) in menuItems" :key="menuIdx">
                <router-link :to="{ name: item.link }" class="navbar__link uk-text-left" v-e2e="item.id">
                  <core-svg width="20" :src="require('@/assets/images/icons/' + item.icon + '.svg')" />
                  <span class="navbar__link-text">{{ $t('core.components.navAvatar.' + item.id) }}</span>
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import { LIMITS, MODULES } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import CoreNavSetupProgressBtn from './CoreNavSetupProgressBtn.vue';

export default {
  name: 'CoreNavAvatarMobileBtn',
  components: {
    CoreNavSetupProgressBtn,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();

    const sidebar = ref(null);

    const limits = computed(() => store.state.core.limits);
    const user = computed(() => store.state.account.user);
    const menu = computed(() => store.getters['core/userMenu']);

    const onOpenSidebar = () => {
      uikit.drawer.toggle(sidebar.value, true);
    };

    const onCloseSidebar = () => {
      uikit.drawer.toggle(sidebar.value, false);
    };

    return {
      LIMITS,
      MODULES,
      limits,
      sidebar,
      menu,
      user,

      onOpenSidebar,
      onCloseSidebar,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar__button ::v-deep() .avatar-wrapper {
  margin-left: auto;
}
.sidebar {
  width: 300px;

  &-bg {
    background-color: $base-color-darken;
    box-shadow: 0 4px 4px 0 rgba($color-black, 0.2);
  }

  .uk-offcanvas-close {
    top: 6px;
    color: $color-white;
  }

  .core-user-card {
    &__name {
      color: $color-white;
    }
    &__email {
      color: rgba($color-white, 0.75);
    }
  }

  ::v-deep() .percent {
    color: rgba($color-white, 0.75) !important;
  }

  .navbar__link {
    color: $color-white;
    padding: 12px 27px;

    &-text {
      padding: 0 20px;
    }

    &.router-link-active {
      color: $primary-color;
    }
  }
}
</style>
