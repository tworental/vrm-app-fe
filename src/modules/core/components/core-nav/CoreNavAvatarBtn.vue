<template>
  <div class="uk-inline">
    <button class="navbar__button uk-button uk-button-text" type="button">
      <core-avatar
        :size="38"
        :username="user.fullName || user.email"
        :src="user.avatar"
        color="#504B41"
        borderColor="#5A80F9"
      />
    </button>

    <div class="uk-card uk-card-default core-nav-avatar-card" uk-dropdown="mode: click">
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
      <div class="uk-card-body core-nav-avatar-card__body">
        <div>
          <ul class="uk-nav uk-nav-default">
            <template v-for="(menuItems, idx) in menu" :key="idx">
              <li
                v-for="(item, menuIdx) in menuItems"
                :key="item.id"
                class="uk-dropdown-close core-nav-avatar-card__nav-item"
                :class="{ '--bordered': menuIdx === 0}"
              >
                <router-link :to="{ name: item.link }" class="core-nav-avatar-card__link" v-e2e="item.id">
                  <core-svg width="20" :src="require('@/assets/images/icons/' + item.icon + '.svg')" />
                  <span class="label">{{ $t('core.components.navAvatar.' + item.id) }}</span>
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
import { computed } from 'vue';
import { useStore } from 'vuex';

import { LIMITS, MODULES } from '@/utils/acl';
import CoreNavSetupProgressBtn from './CoreNavSetupProgressBtn.vue';

export default {
  name: 'CoreNavAvatarBtn',
  components: {
    CoreNavSetupProgressBtn,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);
    const menu = computed(() => store.getters['core/userMenu']);

    return {
      LIMITS,
      MODULES,
      user,
      limits,
      menu,
    };
  },
};
</script>
