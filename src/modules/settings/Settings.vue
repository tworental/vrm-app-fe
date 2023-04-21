<template>
  <core-layout :has-nav="true">
    <template v-slot:nav="{ onNavItemClicked }">
      <div class="navbar navbar--page uk-padding-remove uk-navbar-container vertical uk-navbar uk-navbar-transparent">
        <div v-for="(item, key) in items" :key="key" class="uk-margin-top">
          <div class="uk-nav-header uk-margin-small-bottom sidebar-content">{{ item.title }}</div>
          <ul class="uk-nav uk-nav-default">
            <li
              v-for="(link, idx) in item.children"
              :key="idx"
              class="uk-nav__item"
              @click="onNavItemClicked"
            >
              <router-link :to="{ name: link.value }">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #default>
      <router-view />
    </template>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { hasAccess, LIMITS, MODULES } from '@/utils/acl';

export default {
  setup() {
    const i18n = useI18n();
    const store = useStore();

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);

    const items = computed(() => [
      {
        title: i18n.t('settings.shared.menu.generalSettings'),
        children: [
          {
            label: i18n.t('settings.shared.menu.salesChannels'),
            value: 'settings-sales-channels',
            limitName: LIMITS.APP_SALES_CHANNELS_ENABLED,
            acl: MODULES.SALES_CHANNELS,
          },
          {
            label: i18n.t('settings.shared.menu.customerContacts'),
            value: 'settings-customer-contacts',
            // limitName: LIMITS.APP_SALES_CHANNELS_ENABLED,
            acl: MODULES.CUSTOMER_CONTACTS,
          },
        ],
      },
      {
        title: i18n.t('settings.shared.menu.rentalsSettings'),
        children: [
          {
            label: i18n.t('settings.shared.menu.services'),
            value: 'settings-services',
            limitName: LIMITS.APP_SERVICES_ENABLED,
            acl: MODULES.SERVICES,
          },
          {
            label: i18n.t('settings.shared.menu.fees'),
            value: 'settings-fees',
            limitName: [LIMITS.APP_FEES_ENABLED, LIMITS.APP_TAXES_ENABLED],
            acl: [MODULES.FEES, MODULES.TAXES],
          },
          {
            label: i18n.t('settings.shared.menu.seasonRates'),
            value: 'settings-season-rates',
            limitName: LIMITS.APP_RATE_SEASONS_ENABLED,
            acl: MODULES.RATE_SEASONS,
          },
        ],
      },
    ]
      .map((menu) => ({
        title: menu.title,
        children: menu.children.filter((item) => {
          if (Array.isArray(item.limitName)) {
            return item.limitName.some((limit, idx) => hasAccess(
              limits.value,
              limit,
              user.value,
              item.acl[idx],
            ));
          }

          return hasAccess(limits.value, item.limitName, user.value, item.acl);
        }),
      }))
      .filter((menu) => menu.children.length));

    return {
      items,
      user,
      limits,
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  &-header {
    padding: 15px;
    margin-top: 4px;
    border-bottom: 1px solid rgba($alt-color, 0.4);
  }
  &-content {
    font-size: 0.75rem;
    padding: 0 15px;
    color: rgba($base-color-darken, 0.5);
    opacity: 1;
    text-transform: uppercase;
  }
}
.uk-nav__item {
  a {
    position: relative;
    border-left: 4px solid transparent;
    font-size: 0.75rem;
    padding: 12px 10px 12px 15px;
  }
  .router-link-active {
    background-color: rgba($primary-color, 0.1);
    border-left-color: $primary-color;
    font-weight: 500;
  }
}
</style>
